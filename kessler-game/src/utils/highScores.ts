import { Redis } from '@upstash/redis';

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

const useLocalStorage = typeof window !== 'undefined' && !import.meta.env.UPSTASH_REDIS_REST_URL;

let redis: Redis | null = null;
if (!useLocalStorage) {
  try {
    redis = Redis.fromEnv();
  } catch {
    // Redis not configured, will fall back to localStorage
  }
}

export async function getHighScores(): Promise<HighScore[]> {
  try {
    if (useLocalStorage) {
      const stored = localStorage.getItem(HIGH_SCORES_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    }

    if (!redis) return [];
    const scores = await redis.zrange('high-scores', 0, MAX_HIGH_SCORES - 1, { rev: true });
    if (!scores || scores.length === 0) return [];
    return (scores as string[]).map((s: string) => JSON.parse(s) as HighScore);
  } catch (error) {
    console.error('Failed to load high scores:', error);
    return [];
  }
}

export async function saveHighScore(score: HighScore): Promise<void> {
  try {
    if (useLocalStorage) {
      const stored = localStorage.getItem(HIGH_SCORES_KEY);
      const scores = stored ? JSON.parse(stored) : [];
      scores.push(score);
      scores.sort((a: HighScore, b: HighScore) => b.score - a.score);
      const topScores = scores.slice(0, MAX_HIGH_SCORES);
      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(topScores));
      return;
    }

    if (!redis) return;
    
    await redis.zadd('high-scores', { score: score.score, member: JSON.stringify(score) });
    
    const count = await redis.zcard('high-scores');
    if (count > MAX_HIGH_SCORES) {
      await redis.zpopmin('high-scores', count - MAX_HIGH_SCORES);
    }
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
    if (useLocalStorage) {
      localStorage.removeItem(HIGH_SCORES_KEY);
      return;
    }

    if (!redis) return;
    await redis.del('high-scores');
  } catch (error) {
    console.error('Failed to clear high scores:', error);
  }
}
