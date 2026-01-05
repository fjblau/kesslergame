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

const isDevelopment = import.meta.env.DEV;

async function callAPI<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
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

    const result = await callAPI<{ success: boolean }>(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });

    return result?.success ?? false;
  } catch (error) {
    console.error('Failed to submit feedback:', error);
    return false;
  }
}
