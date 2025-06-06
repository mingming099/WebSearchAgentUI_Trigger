import { useState, useEffect, useCallback } from 'react';
import { TaskRecoveryInfo, TaskStatusResponse } from '@/types/websearch';
import { 
  getProcessingEntries, 
  updateHistoryEntryStatus
} from '@/lib/localStorage';

export function useTaskRecovery() {
  const [recoverableTasks, setRecoverableTasks] = useState<TaskRecoveryInfo[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check task status via API
  const checkTaskStatus = useCallback(async (runId: string): Promise<TaskStatusResponse | null> => {
    try {
      const response = await fetch(`/api/task-status/${runId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Task ${runId} not found on server`);
          return null;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const taskInfo: TaskStatusResponse = await response.json();
      return taskInfo;
    } catch (error) {
      console.error(`Failed to check status for task ${runId}:`, error);
      return null;
    }
  }, []);

  // Update history entry based on server status
  const updateTaskFromServerStatus = useCallback((runId: string, serverStatus: TaskStatusResponse) => {
    const triggerStatus = serverStatus.status;
    
    // Map Trigger.dev status to our history status
    let historyStatus: 'complete' | 'failed' | 'canceled';
    let result = undefined;
    let error = undefined;

    switch (triggerStatus) {
      case 'COMPLETED':
        historyStatus = 'complete';
        result = serverStatus.output;
        break;
      case 'FAILED':
        historyStatus = 'failed';
        error = serverStatus.error || 'Task execution failed';
        break;
      case 'CANCELED':
        historyStatus = 'canceled';
        error = 'Task was canceled';
        break;
      default:
        // Task is still running (PENDING or EXECUTING)
        return false;
    }

    // Update the history entry
    updateHistoryEntryStatus(runId, historyStatus, result, error);
    return true;
  }, []);

  // Check all processing tasks and update their status
  const checkAllProcessingTasks = useCallback(async () => {
    setIsChecking(true);
    setError(null);

    try {
      const processingEntries = getProcessingEntries();
      
      if (processingEntries.length === 0) {
        setRecoverableTasks([]);
        return;
      }

      console.log(`Found ${processingEntries.length} processing tasks to check`);

      // Check status for all processing tasks in parallel
      const statusChecks = processingEntries.map(async (entry) => {
        const serverStatus = await checkTaskStatus(entry.runId);
        
        if (!serverStatus) {
          // Task not found on server - mark as failed
          updateHistoryEntryStatus(
            entry.runId, 
            'failed', 
            undefined, 
            'Task not found on server'
          );
          return null;
        }

        // Update history if task is completed
        const wasUpdated = updateTaskFromServerStatus(entry.runId, serverStatus);
        
        if (wasUpdated) {
          // Task completed - no longer recoverable
          return null;
        }

        // Task is still running - it's recoverable
        return {
          runId: entry.runId,
          query: entry.query,
          status: 'processing' as const,
          timestamp: entry.timestamp,
          model: entry.model,
          writeModel: entry.writeModel,
        } as TaskRecoveryInfo;
      });

      const results = await Promise.all(statusChecks);
      const stillProcessing = results.filter((task): task is TaskRecoveryInfo => task !== null);
      
      setRecoverableTasks(stillProcessing);
      
      console.log(`Found ${stillProcessing.length} tasks still running that can be recovered`);
    } catch (error) {
      console.error('Failed to check processing tasks:', error);
      setError(error instanceof Error ? error.message : 'Failed to check task status');
    } finally {
      setIsChecking(false);
    }
  }, [checkTaskStatus, updateTaskFromServerStatus]);

  // Check for recoverable tasks on mount
  useEffect(() => {
    checkAllProcessingTasks();
  }, [checkAllProcessingTasks]);

  // Get current status of a specific task
  const getTaskCurrentStatus = useCallback(async (runId: string) => {
    const serverStatus = await checkTaskStatus(runId);
    
    if (!serverStatus) {
      return null;
    }

    // Update local history if task completed
    updateTaskFromServerStatus(runId, serverStatus);
    
    return serverStatus;
  }, [checkTaskStatus, updateTaskFromServerStatus]);

  // Remove a task from recoverable list (when user dismisses or recovers it)
  const removeRecoverableTask = useCallback((runId: string) => {
    setRecoverableTasks(prev => prev.filter(task => task.runId !== runId));
  }, []);

  // Refresh the recoverable tasks list
  const refreshRecoverableTasks = useCallback(() => {
    checkAllProcessingTasks();
  }, [checkAllProcessingTasks]);

  return {
    // State
    recoverableTasks,
    isChecking,
    error,
    hasRecoverableTasks: recoverableTasks.length > 0,
    
    // Actions
    checkTaskStatus,
    getTaskCurrentStatus,
    removeRecoverableTask,
    refreshRecoverableTasks,
    checkAllProcessingTasks,
  };
} 