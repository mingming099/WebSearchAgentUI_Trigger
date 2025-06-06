"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { 
  AppState, 
  WebSearchInput, 
  WebSearchOutput, 
  WebSearchMetadata,
  TriggerHandle 
} from "@/types/websearch";
import { triggerWebSearchAgent } from "@/lib/trigger";
import { formatErrorMessage, getDefaultModel, getDefaultWriteModel } from "@/lib/utils";
import { addProcessingEntry, updateHistoryEntryStatus } from "@/lib/localStorage";
// Default metadata state
const defaultMetadata: WebSearchMetadata = {
  progress: 0,
  actionHistory: [],
  currentAction: undefined,
  totalIterations: 5,
  currentIteration: 0,
  lastUpdated: new Date().toISOString(),
};

// Default app state
const defaultAppState: AppState = {
  stage: 'idle',
  query: '',
  runId: undefined,
  publicAccessToken: undefined,
  progress: defaultMetadata,
  result: undefined,
  error: undefined,
  showHistory: false,
  selectedHistoryEntry: undefined,
};

type AddToHistoryFn = (query: string, result: WebSearchOutput, model?: string, writeModel?: string) => void;

export function useWebSearch(addToHistory?: AddToHistoryFn) {
  const [state, setState] = useState<AppState>(defaultAppState);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Real-time subscription to run updates
  const { run, error: realtimeError } = useRealtimeRun(
    state.runId || "",
    {
      accessToken: state.publicAccessToken,
      baseURL: process.env.NEXT_PUBLIC_TRIGGER_API_URL,
      enabled: !!(state.runId && state.publicAccessToken && state.stage === 'processing'),
    }
  );

  // Handle real-time updates
  useEffect(() => {
    if (!run || state.stage !== 'processing') return;

    // Validate that this update is for the current run
    if (run.id !== state.runId) {
      return;
    }

    try {
      // Update metadata from run
      if (run.metadata) {
        const metadata = run.metadata as unknown as WebSearchMetadata;
        // Validate and provide defaults for required fields
        const validatedMetadata: WebSearchMetadata = {
          progress: typeof metadata.progress === 'number' ? metadata.progress : 0,
          actionHistory: Array.isArray(metadata.actionHistory) ? metadata.actionHistory : [],
          currentAction: typeof metadata.currentAction === 'string' ? metadata.currentAction : undefined,
          totalIterations: typeof metadata.totalIterations === 'number' ? metadata.totalIterations : 5,
          currentIteration: typeof metadata.currentIteration === 'number' ? metadata.currentIteration : 0,
          lastUpdated: typeof metadata.lastUpdated === 'string' ? metadata.lastUpdated : new Date().toISOString(),
        };
        
        setState(prev => ({
          ...prev,
          progress: validatedMetadata,
        }));
      }

      // Handle completion
      if (run.status === 'COMPLETED' && run.output) {
        const output = run.output as WebSearchOutput;
        setState(prev => {
          const newState = {
            ...prev,
            stage: 'complete' as const,
            result: output,
            progress: {
              ...prev.progress,
              progress: 100,
              currentAction: 'Search completed successfully',
            },
          };
          
          // Update history entry status to complete (instead of adding new entry)
          if (prev.runId && output) {
            updateHistoryEntryStatus(prev.runId, 'complete', output);
            console.log('Updated history entry to complete status:', prev.runId);
          }
          
          return newState;
        });
      }

      // Handle failure
      if (run.status === 'FAILED') {
        setState(prev => {
          // Update history entry status to failed
          if (prev.runId) {
            updateHistoryEntryStatus(prev.runId, 'failed', undefined, 'The search task failed. Please try again.');
            console.log('Updated history entry to failed status:', prev.runId);
          }
          
          return {
            ...prev,
            stage: 'error',
            error: 'The search task failed. Please try again.',
            progress: {
              ...prev.progress,
              currentAction: 'Search failed',
            },
          };
        });
      }

      // Handle cancellation
      if (run.status === 'CANCELED') {
        setState(prev => {
          // Update history entry status to canceled
          if (prev.runId) {
            updateHistoryEntryStatus(prev.runId, 'canceled', undefined, 'The search was canceled.');
            console.log('Updated history entry to canceled status:', prev.runId);
          }
          
          return {
            ...prev,
            stage: 'error',
            error: 'The search was canceled.',
            progress: {
              ...prev.progress,
              currentAction: 'Search canceled',
            },
          };
        });
      }
    } catch (error) {
      console.error('Error processing run update:', error);
      setState(prev => ({
        ...prev,
        stage: 'error',
        error: formatErrorMessage(error),
      }));
    }
  }, [run, state.stage, state.runId, addToHistory]);

  // Handle real-time connection errors
  useEffect(() => {
    if (realtimeError && state.stage === 'processing') {
      console.error('Real-time connection error:', realtimeError);
      setState(prev => ({
        ...prev,
        error: `Real-time connection error: ${formatErrorMessage(realtimeError)}`,
      }));
    }
  }, [realtimeError, state.stage]);

  // Trigger search function
  const triggerSearch = useCallback(async (
    query: string, 
    model?: string, 
    writeModel?: string,
    options?: Partial<WebSearchInput>
  ) => {
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      // Reset state and start processing - Clear previous results immediately
      setState(() => ({
        ...defaultAppState,
        stage: 'processing',
        query: query.trim(),
        result: undefined, // Explicitly clear previous results
        error: undefined, // Clear any previous errors
        progress: {
          ...defaultMetadata,
          currentAction: 'Initializing search...',
          actionHistory: ['Starting web search agent'],
        },
      }));

      // Get final model values with defaults
      const finalModel = model || getDefaultModel();
      const finalWriteModel = writeModel || getDefaultWriteModel();

      // Prepare search input
      const searchInput: WebSearchInput = {
        query: query.trim(),
        searchParams: {
          searchDepth: "advanced",
          topic: "general",
          maxResults: 7,
          ...options?.searchParams,
        },
        extractParams: {
          extractDepth: "advanced",
          includeImages: false,
          ...options?.extractParams,
        },
        model: finalModel,
        writeModel: finalWriteModel,
        maxIterations: 20,
        ...options,
      };

      // Trigger the websearch-agent task
      const handle: TriggerHandle = await triggerWebSearchAgent(searchInput);

      // SAVE TO HISTORY IMMEDIATELY when task is triggered
      const processingEntry = addProcessingEntry(query.trim(), handle.id, finalModel, finalWriteModel);
      console.log('Saved processing entry to history:', processingEntry);

      // Update state with run information
      setState(prev => ({
        ...prev,
        runId: handle.id,
        publicAccessToken: handle.publicAccessToken,
        progress: {
          ...prev.progress,
          currentAction: 'Task triggered successfully, waiting for updates...',
          actionHistory: [...prev.progress.actionHistory, `Task started with ID: ${handle.id}`],
        },
      }));

    } catch (error) {
      console.error('Failed to trigger search:', error);
      setState(prev => ({
        ...prev,
        stage: 'error',
        error: formatErrorMessage(error),
        progress: {
          ...prev.progress,
          currentAction: 'Failed to start search',
        },
      }));
    }
  }, []);

  // Reset to initial state
  const resetSearch = useCallback(() => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setState(defaultAppState);
  }, []);

  // Retry the last search
  const retrySearch = useCallback(() => {
    if (state.query) {
      triggerSearch(state.query);
    }
  }, [state.query, triggerSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    stage: state.stage,
    query: state.query,
    progress: state.progress,
    result: state.result,
    error: state.error,
    runId: state.runId,
    
    // Computed state
    isLoading: state.stage === 'processing',
    isComplete: state.stage === 'complete',
    hasError: state.stage === 'error',
    isIdle: state.stage === 'idle',
    
    // Actions
    triggerSearch,
    resetSearch,
    retrySearch,
    
    // Real-time data
    run,
    realtimeError,
  };
} 