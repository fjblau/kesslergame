export interface PlayRecord {
  playerName: string;
  date: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  completed?: boolean;
  turnsSurvived?: number;
  finalScore?: number;
  gameOverReason?: string;
}

interface GameSession {
  sessionId: string;
  playerName: string;
  startTime: string;
  gameStarted: boolean;
}

const PLAYS_KEY = 'kessler-plays';
const SESSION_KEY = 'kessler-game-session';
const API_BASE = '/api/plays';

const isDevelopment = import.meta.env.DEV;

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

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

export async function logPlayStart(playerName: string): Promise<void> {
  try {
    const startTime = new Date().toISOString();
    const sessionId = generateSessionId();

    const session: GameSession = {
      sessionId,
      playerName,
      startTime,
      gameStarted: true,
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

    const play: PlayRecord = {
      playerName,
      date: startTime,
      startTime,
      completed: false,
    };

    if (isDevelopment) {
      const stored = localStorage.getItem(PLAYS_KEY);
      const plays = stored ? JSON.parse(stored) : [];
      plays.unshift(play);
      localStorage.setItem(PLAYS_KEY, JSON.stringify(plays));
      return;
    }

    await callAPI(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(play),
    });
  } catch (error) {
    console.error('Failed to log play start:', error);
  }
}

export function getActiveSession(): GameSession | null {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as GameSession;
  } catch (error) {
    console.error('Failed to get active session:', error);
    return null;
  }
}

export function clearSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
}

export async function logPlayEnd(data: {
  completed: boolean;
  turnsSurvived?: number;
  finalScore?: number;
  gameOverReason?: string;
}): Promise<void> {
  try {
    const session = getActiveSession();
    if (!session) {
      console.warn('No active session found');
      return;
    }

    const endTime = new Date().toISOString();
    const duration = new Date(endTime).getTime() - new Date(session.startTime).getTime();

    const play: PlayRecord = {
      playerName: session.playerName,
      date: session.startTime,
      startTime: session.startTime,
      endTime,
      duration,
      completed: data.completed,
      turnsSurvived: data.turnsSurvived,
      finalScore: data.finalScore,
      gameOverReason: data.gameOverReason,
    };

    if (isDevelopment) {
      const stored = localStorage.getItem(PLAYS_KEY);
      const plays = stored ? JSON.parse(stored) : [];
      const existingIndex = plays.findIndex(
        (p: PlayRecord) => p.startTime === session.startTime && p.playerName === session.playerName
      );
      
      if (existingIndex !== -1) {
        plays[existingIndex] = play;
      } else {
        plays.unshift(play);
      }
      
      localStorage.setItem(PLAYS_KEY, JSON.stringify(plays));
      clearSession();
      return;
    }

    await callAPI(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(play),
    });
    
    clearSession();
  } catch (error) {
    console.error('Failed to log play end:', error);
  }
}

export async function getPlays(limit = 100): Promise<PlayRecord[]> {
  try {
    if (isDevelopment) {
      const stored = localStorage.getItem(PLAYS_KEY);
      if (!stored) return [];
      const plays = JSON.parse(stored);
      return plays.slice(0, limit);
    }

    const plays = await callAPI<PlayRecord[]>(`${API_BASE}?limit=${limit}`);
    return plays || [];
  } catch (error) {
    console.error('Failed to get plays:', error);
    return [];
  }
}
