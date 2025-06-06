import { useState, useCallback } from 'react';
import { TaskStatusResponse, PublicTokenResponse } from '@/types/websearch';

interface ReconnectionResult {
  runId: string;
  publicAccessToken?: string;
  currentStatus: TaskStatusResponse;
  canReconnect: boolean;
}

export function useTaskReconnection() {
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if task is still running
  const checkTaskStatus = useCallback(async (runId: string): Promise<TaskStatusResponse | null> => {
    try {
      const response = await fetch(`/api/task-status/${runId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Task not found on server');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const taskInfo: TaskStatusResponse = await response.json();
      return taskInfo;
    } catch (error) {
      console.error(`Failed to check status for task ${runId}:`, error);
      throw error;
    }
  }, []);

  // Generate new public access token for a specific run
  const generateToken = useCallback(async (runId: string): Promise<string> => {
    try {
      const response = await fetch('/api/generate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const tokenResponse: PublicTokenResponse = await response.json();
      return tokenResponse.publicAccessToken;
    } catch (error) {
      console.error(`Failed to generate token for task ${runId}:`, error);
      throw error;
    }
  }, []);

  // Main reconnection function
  const reconnectToTask = useCallback(async (runId: string): Promise<ReconnectionResult> => {
    setIsReconnecting(true);
    setError(null);

    try {
      // First, check current task status
      const currentStatus = await checkTaskStatus(runId);
      
      if (!currentStatus) {
        throw new Error('Task not found');
      }

      // Check if task is still running
      const isStillRunning = currentStatus.status === 'PENDING' || currentStatus.status === 'EXECUTING';
      
      if (!isStillRunning) {
        // Task is completed, failed, or canceled - no need to reconnect
        return {
          runId,
          currentStatus,
          canReconnect: false,
        };
      }

      // Task is still running - generate new token for real-time monitoring
      try {
        const publicAccessToken = await generateToken(runId);
        
        return {
          runId,
          publicAccessToken,
          currentStatus,
          canReconnect: true,
        };
      } catch (tokenError) {
        console.warn('Failed to generate token, but task is still running:', tokenError);
        
        // Return status without token - user can still see current state
        return {
          runId,
          currentStatus,
          canReconnect: false,
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      throw error;
    } finally {
      setIsReconnecting(false);
    }
  }, [checkTaskStatus, generateToken]);

  // Quick status check without reconnection
  const quickStatusCheck = useCallback(async (runId: string): Promise<TaskStatusResponse | null> => {
    try {
      return await checkTaskStatus(runId);
    } catch (error) {
      console.error('Quick status check failed:', error);
      return null;
    }
  }, [checkTaskStatus]);

  // Check if a task can be reconnected to (is still running)
  const canReconnectToTask = useCallback(async (runId: string): Promise<boolean> => {
    try {
      const status = await checkTaskStatus(runId);
      return status ? (status.status === 'PENDING' || status.status === 'EXECUTING') : false;
    } catch (error) {
      console.error('Failed to check if task can be reconnected:', error);
      return false;
    }
  }, [checkTaskStatus]);

  // Reset error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isReconnecting,
    error,
    
    // Actions
    reconnectToTask,
    quickStatusCheck,
    canReconnectToTask,
    clearError,
    
    // Utilities
    checkTaskStatus,
    generateToken,
  };
} 