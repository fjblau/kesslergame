import { useState } from 'react';
import { GameSetupScreen } from './components/Setup/GameSetupScreen';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { GameSpeedControl } from './components/TimeControl/GameSpeedControl';
import { useGameSpeed } from './hooks/useGameSpeed';
import { useAppSelector } from './store/hooks';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const satellites = useAppSelector(state => state.game.satellites);
  const debris = useAppSelector(state => state.game.debris);
  const drvs = useAppSelector(state => state.game.debrisRemovalVehicles);
  const step = useAppSelector(state => state.game.step);

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

          <div className="lg:col-span-2">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-blue-300 mb-4">Game Stats</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-900 p-4 rounded">
                  <div className="text-gray-400">Turn</div>
                  <div className="text-2xl font-bold text-white">{step}</div>
                </div>
                <div className="bg-slate-900 p-4 rounded">
                  <div className="text-gray-400">Satellites</div>
                  <div className="text-2xl font-bold text-green-400">{satellites.length}</div>
                </div>
                <div className="bg-slate-900 p-4 rounded">
                  <div className="text-gray-400">Debris</div>
                  <div className="text-2xl font-bold text-red-400">{debris.length}</div>
                </div>
                <div className="bg-slate-900 p-4 rounded">
                  <div className="text-gray-400">Active DRVs</div>
                  <div className="text-2xl font-bold text-blue-400">{drvs.length}</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
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
