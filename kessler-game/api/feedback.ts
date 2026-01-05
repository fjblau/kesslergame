import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

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

const MAX_FEEDBACK = 10000;
const VALID_CATEGORIES = ['Student', 'Educator', 'Professional', 'Retired', 'Other'];

let redis: Redis | null = null;
try {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  
  if (url && token) {
    redis = new Redis({ url, token });
  }
} catch (error) {
  console.error('Redis initialization failed:', error);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!redis) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  try {
    if (req.method === 'POST') {
      const feedback = req.body as Feedback;
      
      if (!feedback || !feedback.playerName || !feedback.timestamp) {
        console.error('Feedback validation failed: missing required fields');
        return res.status(400).json({ error: 'Invalid feedback data: missing required fields' });
      }

      if (typeof feedback.enjoymentRating !== 'number' || feedback.enjoymentRating < 1 || feedback.enjoymentRating > 5) {
        console.error('Feedback validation failed: invalid enjoyment rating', typeof feedback.enjoymentRating);
        return res.status(400).json({ error: 'Invalid enjoyment rating: must be 1-5' });
      }

      if (typeof feedback.learningRating !== 'number' || feedback.learningRating < 1 || feedback.learningRating > 5) {
        console.error('Feedback validation failed: invalid learning rating', typeof feedback.learningRating);
        return res.status(400).json({ error: 'Invalid learning rating: must be 1-5' });
      }

      if (!VALID_CATEGORIES.includes(feedback.userCategory)) {
        console.error('Feedback validation failed: invalid user category', feedback.userCategory);
        return res.status(400).json({ error: 'Invalid user category' });
      }

      if (!feedback.gameContext || typeof feedback.gameContext.score !== 'number') {
        console.error('Feedback validation failed: invalid game context');
        return res.status(400).json({ error: 'Invalid game context data' });
      }

      await redis.lpush('feedback', JSON.stringify(feedback));
      
      const count = await redis.llen('feedback');
      if (count > MAX_FEEDBACK) {
        await redis.ltrim('feedback', 0, MAX_FEEDBACK - 1);
      }

      return res.status(201).json({ success: true });
    }

    if (req.method === 'GET') {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
      const feedbacks = await redis.lrange('feedback', 0, limit - 1);
      
      if (!feedbacks || feedbacks.length === 0) {
        return res.status(200).json([]);
      }
      
      const parsedFeedbacks = feedbacks.map((fb) => JSON.parse(fb as string) as Feedback);
      return res.status(200).json(parsedFeedbacks);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Feedback API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
