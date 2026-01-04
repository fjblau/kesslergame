export interface HighScore {
  playerName: string;
  score: number;
  grade: string;
  date: string;
  difficulty: string;
  turnsSurvived: number;
}

const HIGH_SCORES_KEY = 'kessler-high-scores';
const MAX_HIGH_SCORES = 10;
const API_BASE = '/api/high-scores';

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

export async function getHighScores(): Promise<HighScore[]> {
  try {
    if (isDevelopment) {
      const stored = localStorage.getItem(HIGH_SCORES_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    }

    const scores = await callAPI<HighScore[]>(API_BASE);
    return scores || [];
  } catch (error) {
    console.error('Failed to load high scores:', error);
    return [];
  }
}

export async function saveHighScore(score: HighScore): Promise<void> {
  try {
    if (isDevelopment) {
      const stored = localStorage.getItem(HIGH_SCORES_KEY);
      const scores = stored ? JSON.parse(stored) : [];
      scores.push(score);
      scores.sort((a: HighScore, b: HighScore) => b.score - a.score);
      const topScores = scores.slice(0, MAX_HIGH_SCORES);
      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(topScores));
      return;
    }

    await callAPI(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(score),
    });
  } catch (error) {
    console.error('Failed to save high score:', error);
  }
}

export async function isHighScore(score: number): Promise<boolean> {
  try {
    const scores = await getHighScores();
    if (scores.length < MAX_HIGH_SCORES) return true;
    return score > scores[scores.length - 1].score;
  } catch (error) {
    console.error('Failed to check high score:', error);
    return false;
  }
}

export async function clearHighScores(): Promise<void> {
  try {
    if (isDevelopment) {
      localStorage.removeItem(HIGH_SCORES_KEY);
      return;
    }

    await callAPI(API_BASE, { method: 'DELETE' });
  } catch (error) {
    console.error('Failed to clear high scores:', error);
  }
}
