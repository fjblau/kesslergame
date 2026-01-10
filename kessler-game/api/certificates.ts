import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import { v4 as uuidv4 } from 'uuid';

const CERTIFICATE_TTL = 90 * 24 * 60 * 60;

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

interface CertificateData {
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
  gameVersion?: string;
}

interface StoredCertificate extends CertificateData {
  certificateId: string;
  createdAt: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = process.env.NODE_ENV === 'production' && req.headers.origin
    ? req.headers.origin
    : '*';
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!redis) {
    return res.status(503).json({ 
      success: false,
      error: 'Database not configured',
      code: 'DATABASE_UNAVAILABLE' 
    });
  }

  try {
    if (req.method === 'POST') {
      const certificateData = req.body as CertificateData;
      
      if (!certificateData.playerName || 
          certificateData.finalScore === undefined ||
          typeof certificateData.finalScore !== 'number' ||
          certificateData.finalScore < 0 ||
          !certificateData.grade ||
          !certificateData.scoreBreakdown) {
        return res.status(400).json({
          success: false,
          error: 'Invalid certificate data',
          code: 'INVALID_DATA'
        });
      }

      const certificateId = uuidv4();

      const storageData: StoredCertificate = {
        ...certificateData,
        certificateId,
        createdAt: new Date().toISOString(),
        gameVersion: '2.3.1',
      };

      await redis.set(
        `certificate:${certificateId}`,
        storageData,
        { ex: CERTIFICATE_TTL }
      );

      const baseUrl = req.headers.host?.includes('localhost')
        ? `http://${req.headers.host}`
        : `https://${req.headers.host}`;
      const retrievalUrl = `${baseUrl}/certificate/${certificateId}`;

      const expiresAt = new Date(Date.now() + CERTIFICATE_TTL * 1000).toISOString();

      return res.status(201).json({
        success: true,
        certificateId,
        retrievalUrl,
        expiresAt,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Certificate creation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create certificate',
      code: 'STORAGE_FAILED'
    });
  }
}
