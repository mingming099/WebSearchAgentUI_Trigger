import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@trigger.dev/sdk/v3';
import { PublicTokenResponse } from '@/types/websearch';

export async function POST(request: NextRequest) {
  try {
    // Check if TRIGGER_SECRET_KEY is available (server-side only)
    if (!process.env.TRIGGER_SECRET_KEY) {
      console.error('TRIGGER_SECRET_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error: TRIGGER_SECRET_KEY not set' },
        { status: 500 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { runId } = body;

    // Validate runId parameter
    if (!runId || typeof runId !== 'string') {
      return NextResponse.json(
        { error: 'runId is required and must be a string' },
        { status: 400 }
      );
    }

    // Generate a new public access token scoped to the specific run
    const publicToken = await auth.createPublicToken({
      scopes: {
        read: {
          runs: [runId],
        },
      },
      // Set expiration time to 24 hours
      expirationTime: "24h",
    });

    // Prepare response
    const response: PublicTokenResponse = {
      publicAccessToken: publicToken,
      runId: runId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Failed to generate public access token:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      // Check if it's an authentication error
      if (error.message.includes('unauthorized') || error.message.includes('401')) {
        return NextResponse.json(
          { error: 'Unauthorized: Invalid secret key' },
          { status: 401 }
        );
      }
      
      // Check if it's a validation error
      if (error.message.includes('invalid') || error.message.includes('validation')) {
        return NextResponse.json(
          { error: 'Invalid request: Check runId format' },
          { status: 400 }
        );
      }
    }

    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';

    return NextResponse.json(
      { error: `Failed to generate token: ${errorMessage}` },
      { status: 500 }
    );
  }
} 