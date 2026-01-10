import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

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

interface StoredCertificate {
  playerName: string;
  finalScore: number;
  grade: string;
  turnsSurvived: number;
  maxTurns: number;
  finalBudget: number;
  satellitesLaunched: number;
  debrisRemoved: number;
  totalDebris: number;
  difficulty: string;
  scoreBreakdown: {
    satelliteLaunchScore: number;
    debrisRemovalScore: number;
    satelliteRecoveryScore: number;
    budgetManagementScore: number;
    survivalScore: number;
  };
  certificateId: string;
  createdAt: string;
  gameVersion?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = process.env.NODE_ENV === 'production' && req.headers.origin
    ? req.headers.origin
    : '*';
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!redis) {
    return res.status(503).json({
      success: false,
      error: 'Database not configured',
      code: 'DATABASE_UNAVAILABLE'
    });
  }

  try {
    const { id } = req.query;
    const format = (req.query.format as string) || 'json';

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid certificate ID',
        code: 'INVALID_ID'
      });
    }

    const data = await redis.get(`certificate:${id}`);

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Certificate not found or expired',
        code: 'NOT_FOUND'
      });
    }

    const certificate = data as StoredCertificate;

    if (format === 'json') {
      const ttl = await redis.ttl(`certificate:${id}`);
      const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
      
      return res.status(200).json({
        success: true,
        certificate,
        expiresAt,
      });
    }

    return res.status(200).json({
      success: true,
      certificate,
    });

  } catch (error) {
    console.error('Certificate retrieval error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve certificate',
      code: 'RETRIEVAL_FAILED'
    });
  }
}
