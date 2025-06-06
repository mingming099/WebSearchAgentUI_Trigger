import { NextRequest, NextResponse } from 'next/server';
import { runs } from '@trigger.dev/sdk/v3';
import { TaskStatusResponse, WebSearchMetadata } from '@/types/websearch';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    // Check if TRIGGER_SECRET_KEY is available (server-side only)
    if (!process.env.TRIGGER_SECRET_KEY) {
      console.error('TRIGGER_SECRET_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error: TRIGGER_SECRET_KEY not set' },
        { status: 500 }
      );
    }

    const { runId } = await params;

    // Validate runId parameter
    if (!runId || typeof runId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid runId parameter' },
        { status: 400 }
      );
    }

    // Retrieve task status from Trigger.dev
    const run = await runs.retrieve(runId);

    // Map Trigger.dev status to our response format
    const response: TaskStatusResponse = {
      runId: run.id,
      status: run.status,
      metadata: run.metadata as WebSearchMetadata | undefined,
      output: run.output,
      error: run.status === 'FAILED' ? 'Task execution failed' : undefined,
      createdAt: run.createdAt?.toISOString(),
      updatedAt: run.updatedAt?.toISOString(),
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Failed to retrieve task status:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      // Check if it's a "not found" error
      if (error.message.includes('not found') || error.message.includes('404')) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }
      
      // Check if it's an authentication error
      if (error.message.includes('unauthorized') || error.message.includes('401')) {
        return NextResponse.json(
          { error: 'Unauthorized access to task' },
          { status: 401 }
        );
      }
    }

    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';

    return NextResponse.json(
      { error: `Failed to retrieve task status: ${errorMessage}` },
      { status: 500 }
    );
  }
} 