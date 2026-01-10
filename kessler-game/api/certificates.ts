import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import { v4 as uuidv4 } from 'uuid';

const CERTIFICATE_TTL = 90 * 24 * 60 * 60;

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const certificateData = req.body as CertificateData;
      
      if (!certificateData.playerName || certificateData.finalScore === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Invalid certificate data',
          code: 'INVALID_DATA'
        });
      }

      const certificateId = uuidv4();
      
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });

      const storageData: StoredCertificate = {
        ...certificateData,
        certificateId,
        createdAt: new Date().toISOString(),
        gameVersion: '2.3.1',
      };

      await redis.set(
        `certificate:${certificateId}`,
        JSON.stringify(storageData),
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

    } catch (error) {
      console.error('Certificate creation error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create certificate',
        code: 'STORAGE_FAILED'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
