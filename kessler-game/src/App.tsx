import { useState } from 'react';
import { GameSetupScreen } from './components/Setup/GameSetupScreen';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { GameSpeedControl } from './components/TimeControl/GameSpeedControl';
import { StatsPanel } from './components/StatsPanel/StatsPanel';
import { OrbitVisualization } from './components/GameBoard/OrbitVisualization';
import { useGameSpeed } from './hooks/useGameSpeed';

function App() {
  const [gameStarted, setGameStarted] = useState(false);

  useGameSpeed();

  if (!gameStarted) {
    return <GameSetupScreen onStart={() => setGameStarted(true)} />;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Kessler Simulation
          </h1>
          <p className="text-gray-400 mt-2">Phase 1: Interactive Inputs Demo</p>
        </header>

        <div className="flex justify-center mb-6">
          <GameSpeedControl />
        </div>

        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div>
            <ControlPanel />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <OrbitVisualization />
            <StatsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
