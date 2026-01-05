export interface PlayRecord {
  playerName: string;
  date: string;
}

const PLAYS_KEY = 'kessler-plays';
const API_BASE = '/api/plays';

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

export async function logPlay(playerName: string): Promise<void> {
  try {
    const play: PlayRecord = {
      playerName,
      date: new Date().toISOString(),
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
    console.error('Failed to log play:', error);
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
