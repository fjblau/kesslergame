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

export function getHighScores(): HighScore[] {
  try {
    const stored = localStorage.getItem(HIGH_SCORES_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load high scores:', error);
    return [];
  }
}

export function saveHighScore(score: HighScore): void {
  try {
    const scores = getHighScores();
    scores.push(score);
    scores.sort((a, b) => b.score - a.score);
    const topScores = scores.slice(0, MAX_HIGH_SCORES);
    localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(topScores));
  } catch (error) {
    console.error('Failed to save high score:', error);
  }
}

export function isHighScore(score: number): boolean {
  const scores = getHighScores();
  if (scores.length < MAX_HIGH_SCORES) return true;
  return score > scores[scores.length - 1].score;
}

export function clearHighScores(): void {
  try {
    localStorage.removeItem(HIGH_SCORES_KEY);
  } catch (error) {
    console.error('Failed to clear high scores:', error);
  }
}
