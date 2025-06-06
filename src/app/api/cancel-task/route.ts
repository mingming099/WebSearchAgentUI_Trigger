import { NextRequest, NextResponse } from 'next/server';
import { runs } from '@trigger.dev/sdk/v3';

interface CancelTaskRequest {
  runId: string;
}

interface CancelTaskResponse {
  success: boolean;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check if TRIGGER_SECRET_KEY is available (server-side only)
    if (!process.env.TRIGGER_SECRET_KEY) {
      console.error('TRIGGER_SECRET_KEY environment variable is not set');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Server configuration error: TRIGGER_SECRET_KEY not set' 
        } as CancelTaskResponse,
        { status: 500 }
      );
    }

    // Parse the request body
    const body: CancelTaskRequest = await request.json();
    const { runId } = body;

    // Validate required fields
    if (!runId || typeof runId !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'runId is required and must be a string' 
        } as CancelTaskResponse,
        { status: 400 }
      );
    }

    // Cancel the task using Trigger.dev SDK
    await runs.cancel(runId);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Task cancellation requested successfully',
    } as CancelTaskResponse);

  } catch (error) {
    console.error('Failed to cancel task:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';

    return NextResponse.json(
      { 
        success: false, 
        message: `Failed to cancel task: ${errorMessage}` 
      } as CancelTaskResponse,
      { status: 500 }
    );
  }
} 