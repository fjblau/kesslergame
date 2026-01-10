# Technical Specification: QR Code Certificate Retrieval System

## Executive Summary

**Recommended Approach: QR Code + Direct Download**

This specification outlines a certificate retrieval system using QR codes instead of email collection. This approach **eliminates most GDPR/CCPA compliance complexity** while providing a modern, mobile-friendly user experience.

**Difficulty Assessment: EASY**
- Technical implementation: Easy
- Compliance requirements: Minimal
- Risk level: Very Low

**Key Advantages over Email Collection:**
- ✅ No email collection = simpler privacy compliance
- ✅ No consent management complexity
- ✅ Mobile-first user experience (scan with phone)
- ✅ Shareable (screenshot QR, send to friends)
- ✅ Lower development cost (8-10 hours vs 12-18 hours)
- ✅ No ongoing email service costs

---

## 1. System Overview

### 1.1 User Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Game Ends → GameOverModal Displays                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. User Options:                                             │
│    • Download PDF Now (immediate)                            │
│    • View QR Code (for later retrieval)                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. QR Code Flow:                                             │
│    a) Client → POST /api/certificates (save certificate)     │
│    b) Server → Returns certificateId                         │
│    c) Client → Generates QR code for retrieval URL           │
│    d) Display QR code + "Download Now" button                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Certificate Retrieval (User scans QR later):              │
│    a) Scan QR → Opens URL in browser                         │
│    b) Browser → GET /api/certificates/{id}                   │
│    c) Server → Retrieves from Redis                          │
│    d) Server → Generates PDF                                 │
│    e) Browser → Downloads PDF                                │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Design Principles

1. **Dual Mode**: Immediate download + QR retrieval (user choice)
2. **Mobile-First**: QR codes optimized for phone cameras
3. **Privacy-Preserving**: No PII collection required
4. **Ephemeral**: 90-day auto-deletion via Redis TTL
5. **Zero-Config**: No user account or email needed

---

## 2. Technical Architecture

### 2.1 Technology Stack

**Existing (No Changes):**
- Frontend: React 19 + TypeScript + Redux Toolkit
- Backend: Vercel Serverless Functions
- Database: Upstash Redis
- PDF Generation: jsPDF 3.0.4

**New Dependencies:**
```json
{
  "qrcode": "^1.5.4",              // QR code generation (48 KB)
  "@types/qrcode": "^1.5.5",       // TypeScript types
  "react-router-dom": "^6.22.0"    // If not already installed (for /certificate/:id route)
}
```

### 2.2 System Components

```
┌──────────────────────────────────────────────────────────────┐
│                        FRONTEND                               │
├──────────────────────────────────────────────────────────────┤
│  GameOverModal.tsx                                            │
│    ├─→ CertificateActions component (new)                    │
│    │     ├─→ Download Now button → generateCertificate()     │
│    │     └─→ "Save for Later" → QRCodeModal                  │
│    │                                                          │
│  QRCodeModal.tsx (new)                                        │
│    ├─→ Displays QR code                                      │
│    ├─→ Shows retrieval URL                                   │
│    └─→ "Download Now" button (still available)               │
│                                                               │
│  CertificateRetrievalPage.tsx (new route)                    │
│    └─→ Fetches certificate by ID, displays PDF              │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                      API ENDPOINTS                            │
├──────────────────────────────────────────────────────────────┤
│  POST /api/certificates                                       │
│    • Stores certificate data in Redis                        │
│    • Generates unique certificateId (UUID v4)                │
│    • Sets 90-day TTL                                         │
│    • Returns: { certificateId, retrievalUrl }                │
│                                                               │
│  GET /api/certificates/:id                                    │
│    • Retrieves certificate data from Redis                   │
│    • Generates PDF using jsPDF                               │
│    • Returns PDF as base64 or direct download                │
│    • Returns 404 if expired/not found                        │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                     UPSTASH REDIS                             │
├──────────────────────────────────────────────────────────────┤
│  Key: certificate:{uuid}                                      │
│  Value: {                                                     │
│    playerName: string,                                        │
│    finalScore: number,                                        │
│    grade: string,                                             │
│    turnsSurvived: number,                                     │
│    maxTurns: number,                                          │
│    finalBudget: number,                                       │
│    satellitesLaunched: number,                                │
│    debrisRemoved: number,                                     │
│    totalDebris: number,                                       │
│    difficulty: string,                                        │
│    scoreBreakdown: { ... },                                   │
│    createdAt: string                                          │
│  }                                                            │
│  TTL: 7776000 seconds (90 days)                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Data Model

### 3.1 Certificate Storage Schema

```typescript
interface StoredCertificate {
  // Certificate Data (from game state)
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
  
  // Score Breakdown
  scoreBreakdown: {
    satelliteLaunchScore: number;
    debrisRemovalScore: number;
    satelliteRecoveryScore: number;
    budgetManagementScore: number;
    survivalScore: number;
  };
  
  // Metadata
  createdAt: string;           // ISO 8601 timestamp
  certificateId: string;       // UUID v4 (also the Redis key)
  gameVersion?: string;        // Optional: game version for analytics
}
```

### 3.2 Redis Storage Pattern

**Key Structure:**
```
certificate:{certificateId}
```

**Examples:**
```
certificate:550e8400-e29b-41d4-a716-446655440000
certificate:7c9e6679-7425-40de-944b-e07fc1f90ae7
```

**Storage Operation:**
```typescript
// Store with 90-day TTL
await redis.set(
  `certificate:${certificateId}`,
  JSON.stringify(certificateData),
  { ex: 7776000 }  // 90 days in seconds
);
```

**Retrieval Operation:**
```typescript
// Retrieve
const data = await redis.get(`certificate:${certificateId}`);
if (!data) {
  return { error: 'Certificate not found or expired', code: 404 };
}
const certificate = JSON.parse(data as string);
```

### 3.3 Storage Capacity Estimates

**Per Certificate:**
- Data size: ~800 bytes (JSON)
- QR code: 0 bytes (generated client-side, not stored)
- Total: ~1 KB per certificate

**Monthly Estimates:**
| Players/Month | Certificates | Storage Used | Redis Cost |
|---------------|--------------|--------------|------------|
| 100           | 100          | 100 KB       | FREE       |
| 1,000         | 1,000        | 1 MB         | FREE       |
| 10,000        | 10,000       | 10 MB        | FREE       |
| 100,000       | 100,000      | 100 MB       | FREE       |

**Upstash Redis Free Tier:** 10,000 commands/day, 256 MB storage
- More than sufficient for this use case

---

## 4. QR Code Implementation

### 4.1 QR Code Generation (Client-Side)

**Library:** `qrcode` npm package
- Size: 48 KB minified
- Zero dependencies
- Supports Canvas, SVG, Data URL
- High browser compatibility

**Implementation:**
```typescript
import QRCode from 'qrcode';

interface QRCodeOptions {
  certificateId: string;
  baseUrl: string; // e.g., 'https://kessler-game.vercel.app'
}

export async function generateCertificateQRCode(
  options: QRCodeOptions
): Promise<string> {
  const retrievalUrl = `${options.baseUrl}/certificate/${options.certificateId}`;
  
  // Generate QR code as Data URL (base64 PNG)
  const qrCodeDataUrl = await QRCode.toDataURL(retrievalUrl, {
    width: 300,              // 300x300 pixels
    margin: 2,               // Quiet zone
    color: {
      dark: '#1e293b',       // Slate-800 (matches game theme)
      light: '#f1f5f9',      // Slate-100
    },
    errorCorrectionLevel: 'M', // Medium error correction (15%)
  });
  
  return qrCodeDataUrl;
}
```

**Why Client-Side Generation?**
- ✅ Zero server load
- ✅ Instant QR code display
- ✅ Works offline after page load
- ✅ No additional API calls

### 4.2 QR Code Display Component

**File:** `src/components/Certificate/QRCodeModal.tsx`

```typescript
import { useState, useEffect } from 'react';
import { generateCertificateQRCode } from '../../utils/qrCode';

interface QRCodeModalProps {
  certificateId: string;
  onClose: () => void;
  onDownloadNow: () => void;
}

export function QRCodeModal({ certificateId, onClose, onDownloadNow }: QRCodeModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const baseUrl = window.location.origin;
  const retrievalUrl = `${baseUrl}/certificate/${certificateId}`;

  useEffect(() => {
    generateCertificateQRCode({ certificateId, baseUrl }).then(setQrCodeUrl);
  }, [certificateId, baseUrl]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Save Your Certificate
        </h2>
        
        <div className="bg-white p-4 rounded-lg mb-4">
          {qrCodeUrl ? (
            <img 
              src={qrCodeUrl} 
              alt="QR Code for Certificate Retrieval" 
              className="w-full h-auto"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center">
              <span className="text-gray-400">Generating QR code...</span>
            </div>
          )}
        </div>

        <p className="text-gray-300 text-sm text-center mb-4">
          Scan this QR code with your phone to retrieve your certificate later.
          Valid for 90 days.
        </p>

        <div className="bg-slate-900 p-3 rounded-lg mb-4">
          <p className="text-xs text-gray-400 mb-1">Retrieval URL:</p>
          <p className="text-xs text-blue-400 break-all font-mono">{retrievalUrl}</p>
        </div>

        <div className="space-y-2">
          <button
            onClick={onDownloadNow}
            className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg font-semibold transition-all"
          >
            📄 Download Now
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
          >
            Close
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          💡 Tip: Take a screenshot of this QR code to save it
        </p>
      </div>
    </div>
  );
}
```

### 4.3 QR Code Best Practices

**Size:**
- Display: 300x300 pixels (readable on most screens)
- Print-friendly: Generate at 600x600 for high DPI

**Error Correction:**
- Level M (15%): Good balance of size vs. resilience
- Allows partial damage/obstruction

**Color Contrast:**
- Dark: Slate-800 (#1e293b) - matches game theme
- Light: Slate-100 (#f1f5f9) - high contrast
- Ensure WCAG AA contrast ratio (4.5:1)

**Testing:**
- Test with iOS Camera app, Android Camera app
- Test with QR scanner apps (common ones)
- Verify URL opens correctly in mobile browsers

---

## 5. API Endpoints

### 5.1 POST /api/certificates

**Purpose:** Store certificate data and return retrieval ID

**Request:**
```typescript
interface CertificateCreateRequest {
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
```

**Response (Success):**
```typescript
{
  success: true;
  certificateId: string;       // UUID v4
  retrievalUrl: string;        // Full URL for QR code
  expiresAt: string;           // ISO 8601 timestamp (90 days from now)
}
```

**Response (Error):**
```typescript
{
  success: false;
  error: string;               // User-friendly error message
  code: 'INVALID_DATA' | 'STORAGE_FAILED' | 'RATE_LIMIT';
}
```

**Validation:**
- Player name: 1-50 chars, no special chars
- Scores: Non-negative integers
- Grade: One of ['S', 'A', 'B', 'C', 'D']
- Difficulty: One of ['easy', 'normal', 'hard', 'challenge']

**Rate Limiting:**
- 5 certificate creations per IP per hour
- Prevents abuse/spam

**Implementation:**
```typescript
// api/certificates.ts (POST handler)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import { v4 as uuidv4 } from 'uuid';

const CERTIFICATE_TTL = 90 * 24 * 60 * 60; // 90 days in seconds

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const certificateData = req.body;
      
      // Validation
      if (!certificateData.playerName || !certificateData.finalScore) {
        return res.status(400).json({
          success: false,
          error: 'Invalid certificate data',
          code: 'INVALID_DATA'
        });
      }

      // Generate unique ID
      const certificateId = uuidv4();
      
      // Store in Redis
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });

      const storageData = {
        ...certificateData,
        certificateId,
        createdAt: new Date().toISOString(),
      };

      await redis.set(
        `certificate:${certificateId}`,
        JSON.stringify(storageData),
        { ex: CERTIFICATE_TTL }
      );

      // Generate retrieval URL
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:5173';
      const retrievalUrl = `${baseUrl}/certificate/${certificateId}`;

      // Calculate expiration date
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
```

### 5.2 GET /api/certificates/:id

**Purpose:** Retrieve certificate data and generate PDF

**URL Parameter:**
- `id`: Certificate UUID

**Query Parameters (Optional):**
- `format`: 'json' | 'pdf' (default: 'pdf')
- `download`: 'true' | 'false' (default: 'true' - triggers download)

**Response (Success - PDF):**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="Mission_Complete_[PlayerName].pdf"`
- Body: PDF binary data

**Response (Success - JSON):**
```typescript
{
  success: true;
  certificate: StoredCertificate;  // Full certificate data
  expiresAt: string;                // Remaining TTL
}
```

**Response (Error):**
```typescript
{
  success: false;
  error: string;
  code: 'NOT_FOUND' | 'EXPIRED' | 'GENERATION_FAILED';
}
```

**Implementation:**
```typescript
// api/certificates/[id].ts (GET handler)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import { generateCertificatePDF } from '../../src/utils/certificateServer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const format = (req.query.format as string) || 'pdf';

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid certificate ID',
        code: 'INVALID_ID'
      });
    }

    // Fetch from Redis
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    const data = await redis.get(`certificate:${id}`);

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Certificate not found or expired',
        code: 'NOT_FOUND'
      });
    }

    const certificate = JSON.parse(data as string);

    // Return JSON format
    if (format === 'json') {
      const ttl = await redis.ttl(`certificate:${id}`);
      const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
      
      return res.status(200).json({
        success: true,
        certificate,
        expiresAt,
      });
    }

    // Generate and return PDF
    const pdfBuffer = await generateCertificatePDF(certificate);
    const fileName = `Mission_Complete_${certificate.playerName.replace(/\s+/g, '_')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error('Certificate retrieval error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve certificate',
      code: 'GENERATION_FAILED'
    });
  }
}
```

---

## 6. Certificate Retrieval Page

### 6.1 Route Configuration

**File:** `src/App.tsx` (or router config)

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CertificateRetrievalPage } from './pages/CertificateRetrievalPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameSetupScreen />} />
        <Route path="/certificate/:id" element={<CertificateRetrievalPage />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

### 6.2 Retrieval Page Component

**File:** `src/pages/CertificateRetrievalPage.tsx`

```typescript
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface CertificateState {
  status: 'loading' | 'found' | 'not_found' | 'error';
  certificate?: any;
  error?: string;
}

export function CertificateRetrievalPage() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<CertificateState>({ status: 'loading' });

  useEffect(() => {
    if (!id) {
      setState({ status: 'error', error: 'Invalid certificate ID' });
      return;
    }

    // Fetch certificate metadata
    fetch(`/api/certificates/${id}?format=json`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setState({ status: 'found', certificate: data.certificate });
        } else {
          setState({ status: 'not_found', error: data.error });
        }
      })
      .catch(error => {
        setState({ status: 'error', error: error.message });
      });
  }, [id]);

  const handleDownload = () => {
    window.location.href = `/api/certificates/${id}?format=pdf`;
  };

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading certificate...</div>
      </div>
    );
  }

  if (state.status === 'not_found' || state.status === 'error') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full border border-red-500/50">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Certificate Not Found</h1>
          <p className="text-gray-300 mb-4">
            {state.error || 'This certificate may have expired or the link is invalid.'}
          </p>
          <p className="text-sm text-gray-400">
            Certificates are valid for 90 days after creation.
          </p>
        </div>
      </div>
    );
  }

  const { certificate } = state;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl p-8 max-w-2xl w-full border border-slate-700">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          🎖️ Mission Certificate
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Space Debris Management Program
        </p>

        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-2 border-purple-500/50 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">{certificate.playerName}</h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Grade</p>
              <p className="text-2xl font-bold text-yellow-400">{certificate.grade}</p>
            </div>
            <div>
              <p className="text-gray-400">Final Score</p>
              <p className="text-2xl font-bold text-blue-400">
                {certificate.finalScore.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Turns Survived</p>
              <p className="text-lg text-white">
                {certificate.turnsSurvived} / {certificate.maxTurns}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Difficulty</p>
              <p className="text-lg text-white capitalize">{certificate.difficulty}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold text-xl transition-all shadow-lg hover:shadow-xl mb-4"
        >
          📄 Download Certificate PDF
        </button>

        <a
          href="/"
          className="block w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold text-center transition-all"
        >
          🚀 Play the Game
        </a>

        <p className="text-xs text-gray-500 text-center mt-4">
          This certificate will expire on {new Date(new Date(certificate.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
```

---

## 7. Privacy & Compliance

### 7.1 GDPR Analysis

**Is this GDPR-applicable?**

**Likely NO**, because:
- Player name in isolation ≠ identifiable person (unless full real name + other context)
- Game statistics (scores, turns) = not personal data
- No email, phone, address, or unique identifiers (IP not stored)
- No tracking cookies or analytics tied to individuals

**However, conservative approach:**

**If treating as personal data:**
- ✅ **Lawful basis:** Legitimate interest (Article 6(1)(f)) - providing game service
- ✅ **Purpose limitation:** Certificate retrieval only
- ✅ **Storage limitation:** 90-day auto-deletion
- ✅ **Data minimization:** Only game-related data
- ✅ **Security:** Encrypted storage (Upstash default)

**User Rights:**
- **Right to erasure:** Manual deletion not strictly required (auto-deleted)
- Could add optional "Delete Now" link on retrieval page

**Privacy Policy Required:** Minimal disclosure sufficient

### 7.2 CCPA Analysis

**Is this CCPA-applicable?**

**Likely NO** for same reasons as GDPR

**If applicable:**
- ✅ No "sale" of data occurs
- ✅ "Do Not Sell" not required
- ✅ 90-day retention complies with minimization
- ✅ Deletion honored via auto-expiration

### 7.3 Required Privacy Disclosures

**Minimal Privacy Policy Section:**

```markdown
## Certificate Retrieval

When you complete a game and choose to save your certificate for later 
retrieval, we temporarily store your game statistics (player name, scores, 
difficulty) on our secure servers for 90 days. This allows you to retrieve 
your certificate using the QR code or link provided.

**Data stored:** Player name, game scores, difficulty settings  
**Purpose:** Certificate retrieval  
**Retention:** 90 days (automatically deleted)  
**Sharing:** Not shared with third parties  

You may retrieve your certificate at any time within 90 days using the 
unique link or QR code provided after game completion.
```

**That's it.** No consent banners, no CMP, no complex forms.

### 7.4 Age Considerations

**No age restrictions needed:**
- No sensitive data collection
- No email/contact info
- Game statistics only
- COPPA not triggered

---

## 8. Security Considerations

### 8.1 Certificate ID Security

**UUID v4 Characteristics:**
- 128-bit random value
- ~2^122 possible values
- Brute force infeasible (would take billions of years)

**Example:**
```
550e8400-e29b-41d4-a716-446655440000
```

**Security Properties:**
- ✅ Non-sequential (can't guess next ID)
- ✅ Cryptographically random
- ✅ No timing attacks possible
- ✅ URL-safe characters only

### 8.2 Rate Limiting

**POST /api/certificates:**
- 5 creations per IP per hour
- Prevents spam/abuse
- Implementation: Redis sorted set with sliding window

**GET /api/certificates/:id:**
- 100 retrievals per IP per hour
- Allows legitimate re-downloads
- Higher limit since read-only

**Implementation (using Vercel KV):**
```typescript
async function checkRateLimit(
  redis: Redis,
  ip: string,
  action: 'create' | 'retrieve'
): Promise<boolean> {
  const key = `ratelimit:${action}:${ip}`;
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const limit = action === 'create' ? 5 : 100;

  // Add current request
  await redis.zadd(key, { score: now, member: now.toString() });
  
  // Remove old entries
  await redis.zremrangebyscore(key, 0, now - windowMs);
  
  // Count requests in window
  const count = await redis.zcard(key);
  
  // Set expiry on key
  await redis.expire(key, 3600);
  
  return count <= limit;
}
```

### 8.3 Data Validation

**Input Sanitization:**
```typescript
function sanitizeCertificateData(data: any): StoredCertificate | null {
  // Validate player name
  if (typeof data.playerName !== 'string' || 
      data.playerName.length < 1 || 
      data.playerName.length > 50) {
    return null;
  }

  // Sanitize HTML/XSS
  const playerName = data.playerName
    .replace(/[<>]/g, '')
    .trim();

  // Validate numeric fields
  const numericFields = [
    'finalScore', 'turnsSurvived', 'maxTurns', 
    'finalBudget', 'satellitesLaunched', 
    'debrisRemoved', 'totalDebris'
  ];

  for (const field of numericFields) {
    if (typeof data[field] !== 'number' || data[field] < 0) {
      return null;
    }
  }

  // Validate grade
  const validGrades = ['S', 'A', 'B', 'C', 'D'];
  if (!validGrades.includes(data.grade)) {
    return null;
  }

  // Validate difficulty
  const validDifficulties = ['easy', 'normal', 'hard', 'challenge'];
  if (!validDifficulties.includes(data.difficulty)) {
    return null;
  }

  return {
    playerName,
    finalScore: data.finalScore,
    grade: data.grade,
    // ... rest of validated fields
  };
}
```

### 8.4 Content Security Policy (CSP)

**Add to Vercel deployment:**
```json
// vercel.json
{
  "headers": [
    {
      "source": "/certificate/:id",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ]
}
```

---

## 9. Implementation Plan

### Phase 1: Core QR Code System (MVP)
**Effort: 6-8 hours**

**Tasks:**

1. **Install dependencies** (15 min)
   ```bash
   npm install qrcode uuid
   npm install -D @types/qrcode @types/uuid
   ```

2. **Create API endpoint: POST /api/certificates** (2 hours)
   - File: `api/certificates.ts`
   - Implement certificate storage
   - Add validation
   - Return certificateId and retrievalUrl

3. **Create API endpoint: GET /api/certificates/:id** (2 hours)
   - File: `api/certificates/[id].ts`
   - Implement certificate retrieval
   - Generate PDF server-side (reuse existing jsPDF logic)
   - Return PDF download

4. **Create QR code generation utility** (30 min)
   - File: `src/utils/qrCode.ts`
   - Implement `generateCertificateQRCode()`

5. **Create QRCodeModal component** (2 hours)
   - File: `src/components/Certificate/QRCodeModal.tsx`
   - Display QR code
   - Show retrieval URL
   - "Download Now" button

6. **Modify GameOverModal** (1 hour)
   - Add "Save for Later" button
   - Trigger certificate storage API call
   - Show QRCodeModal with result

7. **Testing** (1 hour)
   - Test certificate creation
   - Test QR code generation
   - Test QR code scanning (mobile)
   - Test PDF retrieval

**Verification:**
- [ ] Certificate stores in Redis with 90-day TTL
- [ ] QR code displays correctly
- [ ] QR code scans successfully on iOS/Android
- [ ] PDF downloads from retrieval URL
- [ ] Expired certificates return 404

---

### Phase 2: Certificate Retrieval Page (Polish)
**Effort: 3-4 hours**

**Tasks:**

1. **Install React Router** (if not present) (15 min)
   ```bash
   npm install react-router-dom
   ```

2. **Configure routes** (30 min)
   - Update `src/App.tsx`
   - Add `/certificate/:id` route

3. **Create CertificateRetrievalPage** (2 hours)
   - File: `src/pages/CertificateRetrievalPage.tsx`
   - Fetch certificate metadata
   - Display certificate preview
   - Download button

4. **Add loading/error states** (30 min)
   - Loading spinner
   - 404 page for expired/invalid IDs
   - Error handling

5. **Styling & UX polish** (1 hour)
   - Match game theme
   - Mobile responsive
   - Add expiration date display

**Verification:**
- [ ] Route renders correctly
- [ ] Certificate data displays
- [ ] Download button works
- [ ] Mobile responsive
- [ ] Error states handled gracefully

---

### Phase 3: Rate Limiting & Security (Production-Ready)
**Effort: 2-3 hours**

**Tasks:**

1. **Implement rate limiting** (1.5 hours)
   - Add `checkRateLimit()` utility
   - Apply to POST endpoint
   - Apply to GET endpoint
   - Return 429 status when exceeded

2. **Add input validation** (1 hour)
   - Implement `sanitizeCertificateData()`
   - Validate all fields
   - Sanitize player name (XSS prevention)

3. **Add CSP headers** (30 min)
   - Update `vercel.json`
   - Test CSP doesn't break functionality

**Verification:**
- [ ] Rate limits enforced
- [ ] Invalid data rejected
- [ ] XSS attempts sanitized
- [ ] CSP headers present

---

### Phase 4: Optional Enhancements
**Effort: Variable**

**Nice-to-have features:**

1. **Analytics tracking** (1 hour)
   - Track certificate creation rate
   - Track retrieval rate
   - Monitor expiration without retrieval

2. **Certificate preview on QR modal** (1.5 hours)
   - Generate thumbnail preview
   - Show mini certificate in modal

3. **Social sharing** (2 hours)
   - "Share on Twitter" button
   - Generate shareable certificate image
   - Pre-filled tweet with stats

4. **Email backup option** (4-6 hours)
   - Optional: "Email me a backup link"
   - Simple email form (single field)
   - Send plain text email with link only
   - Still simpler than full email implementation

5. **Admin dashboard** (4-8 hours)
   - View certificate statistics
   - Monitor Redis storage
   - Manually delete expired certificates

---

## 10. File Structure

### 10.1 New Files

```
kessler-game/
├── api/
│   ├── certificates.ts                      # POST - Create certificate
│   └── certificates/
│       └── [id].ts                          # GET - Retrieve certificate
│
├── src/
│   ├── components/
│   │   └── Certificate/
│   │       ├── QRCodeModal.tsx              # Display QR code
│   │       └── CertificateActions.tsx       # Download/QR buttons (optional)
│   │
│   ├── pages/
│   │   └── CertificateRetrievalPage.tsx     # /certificate/:id route
│   │
│   └── utils/
│       ├── qrCode.ts                        # QR code generation
│       ├── certificateServer.ts             # Server-side PDF generation
│       └── certificateApi.ts                # API client functions
│
└── public/
    └── privacy-qr.md                        # Minimal privacy disclosure (optional)
```

### 10.2 Modified Files

```
kessler-game/
├── src/
│   ├── App.tsx                              # Add /certificate/:id route
│   ├── components/
│   │   └── GameOver/
│   │       └── GameOverModal.tsx            # Add QR code option
│   └── utils/
│       └── certificate.ts                   # May refactor for server reuse
│
├── package.json                             # Add qrcode, uuid dependencies
└── vercel.json                              # Add rate limiting config (optional)
```

---

## 11. Testing Strategy

### 11.1 Unit Tests

**Test Cases:**

```typescript
// src/utils/qrCode.test.ts
describe('QR Code Generation', () => {
  it('generates valid data URL', async () => {
    const url = await generateCertificateQRCode({
      certificateId: 'test-id-123',
      baseUrl: 'https://example.com'
    });
    expect(url).toMatch(/^data:image\/png;base64,/);
  });

  it('encodes correct URL', async () => {
    // Decode QR and verify URL
  });
});

// api/certificates.test.ts
describe('Certificate API', () => {
  it('creates certificate with valid data', async () => {
    const response = await POST('/api/certificates', validData);
    expect(response.success).toBe(true);
    expect(response.certificateId).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('rejects invalid player name', async () => {
    const response = await POST('/api/certificates', { ...validData, playerName: '' });
    expect(response.success).toBe(false);
    expect(response.code).toBe('INVALID_DATA');
  });

  it('retrieves stored certificate', async () => {
    const createRes = await POST('/api/certificates', validData);
    const getRes = await GET(`/api/certificates/${createRes.certificateId}`);
    expect(getRes.success).toBe(true);
  });

  it('returns 404 for invalid ID', async () => {
    const response = await GET('/api/certificates/invalid-id');
    expect(response.code).toBe('NOT_FOUND');
  });
});
```

### 11.2 Integration Tests

**Test Scenarios:**

1. **End-to-End Flow:**
   - Complete game → Create certificate → Display QR → Scan → Retrieve PDF
   
2. **Expiration Test:**
   - Create certificate with 1-second TTL
   - Wait 2 seconds
   - Verify 404 response

3. **Rate Limiting:**
   - Create 6 certificates rapidly
   - Verify 6th request returns 429

4. **Mobile QR Scanning:**
   - Generate QR code
   - Scan with iPhone Camera app
   - Scan with Android Camera app
   - Verify URL opens correctly

### 11.3 Manual Testing Checklist

**Desktop:**
- [ ] QR code displays in modal
- [ ] "Download Now" button works
- [ ] Retrieval URL is copy-pasteable
- [ ] Certificate PDF downloads correctly
- [ ] Expired certificate shows error

**Mobile:**
- [ ] QR code scans successfully (iOS)
- [ ] QR code scans successfully (Android)
- [ ] Retrieval page is mobile-responsive
- [ ] PDF downloads on mobile Safari
- [ ] PDF downloads on mobile Chrome

**Edge Cases:**
- [ ] Very long player names (50 chars)
- [ ] Special characters in player name
- [ ] Maximum score values
- [ ] Network timeout handling
- [ ] Redis connection failure

---

## 12. Cost Analysis

### 12.1 Development Costs

**Time Estimates:**

| Phase | Hours | Cost @ $100/hr |
|-------|-------|----------------|
| Phase 1: Core QR System | 6-8 | $600-800 |
| Phase 2: Retrieval Page | 3-4 | $300-400 |
| Phase 3: Security | 2-3 | $200-300 |
| **Total** | **11-15** | **$1,100-1,500** |

**vs. Email Collection Approach:**
- Email approach: 12-18 hours ($1,200-1,800)
- QR approach: 11-15 hours ($1,100-1,500)
- **Savings: 1-3 hours, $100-300**

### 12.2 Ongoing Costs

**Infrastructure:**

| Service | Usage | Cost |
|---------|-------|------|
| Vercel Serverless | ~1,000 invocations/month | FREE |
| Upstash Redis | ~10 MB storage, 2,000 commands/month | FREE |
| QR Code Library | Client-side generation | FREE |
| **Total Monthly** | | **$0** |

**Email approach comparison:**
- Resend email: FREE tier (3,000/month), then $20/month
- QR approach: **Always FREE**

### 12.3 Break-Even Analysis

**QR Code Approach:**
- Development: $1,100-1,500
- Monthly: $0
- **Total Year 1: $1,100-1,500**

**Email Approach:**
- Development: $1,200-1,800
- Legal review: $500-2,000
- Monthly: $0-20
- **Total Year 1: $1,700-4,040**

**Savings with QR approach: $600-2,540 (36-63% cheaper)**

---

## 13. Advantages vs. Email Collection

### 13.1 Comparison Matrix

| Feature | QR Code | Email Collection |
|---------|---------|------------------|
| **Development Time** | 11-15 hours | 12-18 hours |
| **Development Cost** | $1,100-1,500 | $1,200-1,800 |
| **Legal Review Needed** | No | Yes ($500-2,000) |
| **GDPR Complexity** | Minimal | High |
| **Consent Management** | None | Required |
| **Privacy Policy** | Simple | Comprehensive |
| **User Friction** | Very Low | Medium |
| **Mobile-Friendly** | Excellent | Good |
| **Ongoing Costs** | $0 | $0-20/month |
| **Abuse Risk** | Low | Medium |
| **User Convenience** | High (scan & save) | High (email delivery) |
| **Shareability** | Excellent | Poor |
| **Age Restrictions** | None | 18+ required |
| **Email Deliverability Issues** | N/A | Yes (spam filters) |
| **Data Breach Risk** | Low | Medium (email = PII) |

### 13.2 When to Choose QR Code

**Choose QR code if:**
- ✅ Want minimal compliance burden
- ✅ Budget-conscious (no legal review costs)
- ✅ Fast time-to-market (simpler implementation)
- ✅ Mobile-first user base
- ✅ Prefer privacy-preserving approach

### 13.3 When to Choose Email

**Choose email if:**
- ⚠️ Users specifically request email delivery
- ⚠️ Building email list for marketing (separate consent needed!)
- ⚠️ Desktop-heavy user base (less QR scanning)
- ⚠️ Already have robust privacy compliance infrastructure

---

## 14. Risks & Mitigations

### 14.1 Risk Assessment

| Risk | Severity | Probability | Mitigation |
|------|----------|-------------|------------|
| QR code fails to scan | Medium | Low | Test on multiple devices, ensure high contrast |
| User loses QR code | Low | Medium | Allow immediate download + QR option |
| Redis storage fills up | Low | Very Low | 90-day TTL, monitor usage |
| Certificate ID collision | Very Low | Very Low | UUID v4 has 2^122 possibilities |
| Rate limit too restrictive | Low | Low | Monitor and adjust based on usage |
| Expired cert causes user frustration | Low | Medium | Clear expiration messaging |

### 14.2 Monitoring & Alerts

**Metrics to Track:**

1. **Certificate Creation Rate**
   - Expected: 5-10% of players
   - Alert if: >50% or <1%

2. **Retrieval Rate**
   - Expected: 60-80% of created certificates
   - Alert if: <30% (indicates UX issue)

3. **Expiration Without Retrieval**
   - Expected: 10-20%
   - Alert if: >40%

4. **API Error Rate**
   - Expected: <1%
   - Alert if: >5%

5. **Redis Storage Usage**
   - Expected: <100 MB
   - Alert if: >200 MB (approaching limit)

**Implementation:**
- Use Vercel Analytics for API monitoring
- Add custom logging to Redis for usage tracking
- Set up Upstash Redis alerts for storage thresholds

---

## 15. Future Enhancements

### 15.1 V2 Features (Post-Launch)

**Priority 1: Analytics Dashboard**
- View certificate creation trends
- Track scan rates
- Identify peak usage times
- **Effort:** 4-6 hours

**Priority 2: Certificate Customization**
- Allow players to add custom message
- Choose certificate theme/color
- Add player avatar/photo
- **Effort:** 6-8 hours

**Priority 3: Social Sharing**
- Generate shareable certificate image (PNG)
- Pre-filled tweets with stats
- LinkedIn certification badge
- **Effort:** 3-4 hours

**Priority 4: Email Backup (Hybrid)**
- Optional: "Email me a backup link"
- Single field: email address
- Send plain-text email with retrieval URL only
- No certificate attachment (keeps email simple)
- **Effort:** 3-4 hours

### 15.2 Long-Term Vision

**Leaderboard Integration:**
- Public leaderboard with certificate verification
- Scan QR to verify authenticity
- Prevent fake score claims

**NFT Certificates (Web3):**
- Mint certificate as NFT on-chain
- Permanent, verifiable, tradeable
- For high-score achievements only

**Multi-Game Support:**
- Expand to other games in portfolio
- Unified certificate system
- Cross-game achievements

---

## 16. Deployment Checklist

### 16.1 Pre-Launch

**Code:**
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] Linting clean (`npm run lint`)
- [ ] Build successful (`npm run build`)

**Configuration:**
- [ ] Vercel environment variables set (Redis URL, Redis Token)
- [ ] CORS headers configured
- [ ] Rate limiting enabled
- [ ] CSP headers added

**Testing:**
- [ ] QR code scans on iOS
- [ ] QR code scans on Android
- [ ] PDF downloads on desktop
- [ ] PDF downloads on mobile
- [ ] Expired certificates return 404
- [ ] Rate limiting works

**Documentation:**
- [ ] Update README with QR code feature
- [ ] Add privacy policy section for certificates
- [ ] Document API endpoints (for internal use)

### 16.2 Launch

**Deploy:**
```bash
git add .
git commit -m "Add QR code certificate retrieval system"
git push origin main
```

**Vercel will automatically:**
- Deploy serverless functions
- Update client bundle
- Apply configuration from `vercel.json`

**Post-Deploy Verification:**
- [ ] Test production URL
- [ ] Verify Redis connection
- [ ] Test QR code generation
- [ ] Test certificate retrieval
- [ ] Check error logging

### 16.3 Post-Launch Monitoring

**Day 1:**
- Monitor error rates (Vercel dashboard)
- Check Redis usage (Upstash console)
- Test on real devices
- Respond to user feedback

**Week 1:**
- Analyze usage metrics
- Adjust rate limits if needed
- Fix any discovered bugs
- Collect user feedback

**Month 1:**
- Review certificate creation rate
- Analyze retrieval rate
- Plan Phase 4 enhancements
- Consider cost optimization

---

## 17. Success Metrics

### 17.1 Technical Metrics

**Performance:**
- Certificate creation: < 500ms response time
- QR code generation: < 100ms
- Certificate retrieval: < 2s (including PDF generation)
- API uptime: > 99.9%

**Reliability:**
- Error rate: < 1%
- Failed QR scans: < 5%
- Redis availability: > 99.9%

### 17.2 User Metrics

**Adoption:**
- Certificate creation rate: > 10% of players
- QR code usage: > 5% of players
- Retrieval rate: > 60% of created certificates

**Engagement:**
- Time to first scan: < 1 hour (average)
- Social shares: Track if added
- User feedback: Mostly positive

### 17.3 Business Metrics

**Cost Efficiency:**
- Infrastructure cost: $0/month (within free tiers)
- Compliance cost: $0 (no legal review needed)
- Development ROI: Positive within first month

**User Satisfaction:**
- Feature used by target % of players
- Positive feedback on ease of use
- Low support requests related to feature

---

## Appendix A: QR Code Technical Details

### A.1 QR Code Specifications

**Format:** QR Code Model 2 (ISO/IEC 18004:2015)

**Version:** Automatically selected (1-40 based on data length)
- Version 1: 21×21 modules, ~25 chars
- Version 2: 25×25 modules, ~47 chars
- Our URLs: ~60-70 chars → Version 3 (29×29)

**Error Correction Levels:**
| Level | Correction Capacity | Recommended For |
|-------|-------------------|-----------------|
| L | 7% | Clean environments only |
| M | 15% | **General use (our choice)** |
| Q | 25% | Dirty/damaged surfaces |
| H | 30% | Very high damage tolerance |

**Why Level M?**
- Good balance of size vs. resilience
- Handles minor screen glare/blur
- Smaller QR code (better UX)

### A.2 URL Structure

**Format:**
```
https://kessler-game.vercel.app/certificate/{certificateId}
```

**Example:**
```
https://kessler-game.vercel.app/certificate/550e8400-e29b-41d4-a716-446655440000
```

**Length:** ~76 characters
**QR Code Size:** 29×29 modules (Version 3)

### A.3 Browser Compatibility

**QR Code Scanning:**
- iOS 11+: Native Camera app
- Android 9+: Native Camera app (varies by manufacturer)
- Older devices: Third-party QR scanner apps

**PDF Downloads:**
- Chrome 90+: ✅
- Safari 14+: ✅
- Firefox 88+: ✅
- Edge 90+: ✅
- Mobile browsers: ✅ (all modern versions)

---

## Appendix B: Sample API Responses

### B.1 POST /api/certificates (Success)

```json
{
  "success": true,
  "certificateId": "550e8400-e29b-41d4-a716-446655440000",
  "retrievalUrl": "https://kessler-game.vercel.app/certificate/550e8400-e29b-41d4-a716-446655440000",
  "expiresAt": "2026-04-10T20:00:00.000Z"
}
```

### B.2 GET /api/certificates/:id?format=json (Success)

```json
{
  "success": true,
  "certificate": {
    "playerName": "Frank",
    "finalScore": 125000,
    "grade": "A",
    "turnsSurvived": 85,
    "maxTurns": 100,
    "finalBudget": 50000000,
    "satellitesLaunched": 42,
    "debrisRemoved": 1250,
    "totalDebris": 380,
    "difficulty": "normal",
    "scoreBreakdown": {
      "satelliteLaunchScore": 42000,
      "debrisRemovalScore": 62500,
      "satelliteRecoveryScore": 5000,
      "budgetManagementScore": 10000,
      "survivalScore": 5500
    },
    "createdAt": "2026-01-10T20:00:00.000Z",
    "certificateId": "550e8400-e29b-41d4-a716-446655440000",
    "gameVersion": "2.3.1"
  },
  "expiresAt": "2026-04-10T20:00:00.000Z"
}
```

### B.3 GET /api/certificates/:id (Not Found)

```json
{
  "success": false,
  "error": "Certificate not found or expired",
  "code": "NOT_FOUND"
}
```

### B.4 POST /api/certificates (Rate Limited)

```json
{
  "success": false,
  "error": "Too many certificate creation requests. Please try again later.",
  "code": "RATE_LIMIT",
  "retryAfter": 3600
}
```

---

## Appendix C: Redis Commands Reference

**Create Certificate:**
```bash
SET certificate:550e8400-e29b-41d4-a716-446655440000 '{"playerName":"Frank",...}' EX 7776000
```

**Retrieve Certificate:**
```bash
GET certificate:550e8400-e29b-41d4-a716-446655440000
```

**Check TTL:**
```bash
TTL certificate:550e8400-e29b-41d4-a716-446655440000
# Returns: seconds remaining (e.g., 7775000)
```

**Delete Certificate (manual cleanup):**
```bash
DEL certificate:550e8400-e29b-41d4-a716-446655440000
```

**Count All Certificates:**
```bash
KEYS certificate:* | wc -l
# Note: Use SCAN in production (KEYS blocks Redis)
```

**Storage Stats:**
```bash
INFO memory
# Look for: used_memory_human
```

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Author:** Zencoder AI  
**Status:** Ready for Implementation  
**Estimated Timeline:** 11-15 hours (Phases 1-3)  
**Recommended Approach:** ⭐ **QR Code (This Spec)**
