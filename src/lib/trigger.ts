import type { WebSearchInput, TriggerHandle } from "@/types/websearch";

// Trigger.dev client configuration
const TRIGGER_API_URL = process.env.NEXT_PUBLIC_TRIGGER_API_URL || "https://api.trigger.dev";

/**
 * Triggers the websearch-agent task with the provided input
 * @param input - The search input parameters
 * @returns Promise with the task handle containing run ID and public access token
 */
export async function triggerWebSearchAgent(input: WebSearchInput): Promise<TriggerHandle> {
  try {
    // Call our server-side API route to trigger the task
    const response = await fetch('/api/trigger-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const handle = await response.json();
    
    return {
      id: handle.id,
      publicAccessToken: handle.publicAccessToken,
    };
  } catch (error) {
    console.error("Failed to trigger websearch-agent task:", error);
    throw new Error(
      error instanceof Error 
        ? `Failed to start search: ${error.message}`
        : "Failed to start search: Unknown error"
    );
  }
}

/**
 * Validates the Trigger.dev configuration
 * @returns boolean indicating if configuration is valid
 */
export function validateTriggerConfig(): boolean {
  return !!TRIGGER_API_URL;
}

/**
 * Gets the Trigger.dev API URL
 * @returns The configured API URL
 */
export function getTriggerApiUrl(): string {
  return TRIGGER_API_URL;
} 