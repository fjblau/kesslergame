export interface Feedback {
  playerName: string;
  enjoymentRating: 1 | 2 | 3 | 4 | 5;
  learningRating: 1 | 2 | 3 | 4 | 5;
  userCategory: 'Student' | 'Educator' | 'Professional' | 'Retired' | 'Other';
  comments: string;
  timestamp: string;
  gameContext: {
    score: number;
    grade: string;
    difficulty: string;
    turnsSurvived: number;
  };
}

const FEEDBACK_KEY = 'kessler-feedback';
const API_BASE = '/api/feedback';
const API_TIMEOUT = 10000;

const isDevelopment = import.meta.env.DEV;

async function callAPI<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(endpoint, {
      ...options,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error ${response.status}:`, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('API call timeout after', API_TIMEOUT, 'ms');
    } else {
      console.error('API call failed:', error);
    }
    return null;
  }
}

export async function submitFeedback(feedback: Feedback): Promise<boolean> {
  try {
    const stored = localStorage.getItem(FEEDBACK_KEY);
    const feedbacks = stored ? JSON.parse(stored) : [];
    feedbacks.unshift(feedback);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbacks));

    if (!isDevelopment) {
      console.log('Submitting feedback to API:', { endpoint: API_BASE, feedback });
      const result = await callAPI<{ success: boolean }>(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });

      if (result?.success) {
        console.log('Feedback successfully synced to API');
      } else {
        console.warn('Feedback saved locally but API sync failed');
      }
    }

    return true;
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    return true;
  }
}
