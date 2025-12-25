import { useState } from 'react';
import { GameSetupScreen } from './components/Setup/GameSetupScreen';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { GameSpeedControl } from './components/TimeControl/GameSpeedControl';
import { StatsPanel } from './components/StatsPanel/StatsPanel';
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ControlPanel />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <StatsPanel />

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <h3 className="font-semibold text-blue-300 mb-2">Phase 1 Features Implemented:</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>✅ Game Speed Selector (Pause/Normal/Fast)</li>
                  <li>✅ Insurance Tier Selector (None/Basic/Premium)</li>
                  <li>✅ DRV Target Priority (Auto/Cooperative/Uncooperative Focus)</li>
                  <li>✅ Satellite Purpose Selector (Weather/Comms/GPS/Random)</li>
                  <li>✅ Budget Difficulty Modifier (Easy/Normal/Hard/Challenge)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
