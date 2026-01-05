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
const API_TIMEOUT = 30000;
const MAX_RETRIES = 2;

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
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function submitFeedback(feedback: Feedback): Promise<boolean> {
  try {
    if (isDevelopment) {
      const stored = localStorage.getItem(FEEDBACK_KEY);
      const feedbacks = stored ? JSON.parse(stored) : [];
      feedbacks.unshift(feedback);
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbacks));
      return true;
    }

    let result = null;
    
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      result = await callAPI<{ success: boolean }>(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });
      
      if (result?.success) {
        const stored = localStorage.getItem(FEEDBACK_KEY);
        const feedbacks = stored ? JSON.parse(stored) : [];
        feedbacks.unshift(feedback);
        localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbacks));
        return true;
      }
    }

    console.error('Failed to submit feedback after', MAX_RETRIES + 1, 'attempts');
    return false;
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    return false;
  }
}
