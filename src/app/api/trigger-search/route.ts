import { NextRequest, NextResponse } from 'next/server';
import { tasks } from '@trigger.dev/sdk/v3';
import { WebSearchInput } from '@/types/websearch';

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
    const searchInput: WebSearchInput = body;

    // Validate required fields
    if (!searchInput.query || typeof searchInput.query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      );
    }

    // Trigger the websearch-agent task
    const handle = await tasks.trigger(
      'websearch-agent',
      searchInput
    );

    // Return the handle with run ID and public access token
    return NextResponse.json({
      id: handle.id,
      publicAccessToken: handle.publicAccessToken,
    });

  } catch (error) {
    console.error('Failed to trigger websearch-agent task:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';

    return NextResponse.json(
      { error: `Failed to start search: ${errorMessage}` },
      { status: 500 }
    );
  }
} 