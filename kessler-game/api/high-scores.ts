import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

export interface HighScore {
  playerName: string;
  score: number;
  grade: string;
  date: string;
  difficulty: string;
  turnsSurvived: number;
}

const MAX_HIGH_SCORES = 10;

let redis: Redis | null = null;
try {
  // Support both Upstash and legacy Vercel KV env var names
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  
  if (url && token) {
    redis = new Redis({ url, token });
  }
} catch (error) {
  console.error('Redis initialization failed:', error);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers for client access
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!redis) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  try {
    if (req.method === 'GET') {
      const scores = await redis.zrange('high-scores', 0, MAX_HIGH_SCORES - 1, { rev: true });
      if (!scores || scores.length === 0) {
        return res.status(200).json([]);
      }
      const parsed = scores.map((s) => JSON.parse(s) as HighScore);
      return res.status(200).json(parsed);
    }

    if (req.method === 'POST') {
      const score = req.body as HighScore;
      
      if (!score || typeof score.score !== 'number' || !score.playerName) {
        return res.status(400).json({ error: 'Invalid score data' });
      }

      await redis.zadd('high-scores', { score: score.score, member: JSON.stringify(score) });
      
      const count = await redis.zcard('high-scores');
      if (count > MAX_HIGH_SCORES) {
        await redis.zpopmin('high-scores', count - MAX_HIGH_SCORES);
      }

      return res.status(201).json({ success: true });
    }

    if (req.method === 'DELETE') {
      await redis.del('high-scores');
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('High scores API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
