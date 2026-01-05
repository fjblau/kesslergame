import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

export interface PlayRecord {
  playerName: string;
  date: string;
}

const MAX_PLAYS = 1000;

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
      const play = req.body as PlayRecord;
      
      if (!play || !play.playerName || !play.date) {
        return res.status(400).json({ error: 'Invalid play data' });
      }

      await redis.lpush('plays', JSON.stringify(play));
      
      const count = await redis.llen('plays');
      if (count > MAX_PLAYS) {
        await redis.ltrim('plays', 0, MAX_PLAYS - 1);
      }

      return res.status(201).json({ success: true });
    }

    if (req.method === 'GET') {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
      const plays = await redis.lrange('plays', 0, limit - 1);
      
      if (!plays || plays.length === 0) {
        return res.status(200).json([]);
      }
      
      const parsedPlays = plays.map((play) => JSON.parse(play as string) as PlayRecord);
      return res.status(200).json(parsedPlays);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Plays API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
