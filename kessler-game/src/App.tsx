import { useState } from 'react';
import { GameSetupScreen } from './components/Setup/GameSetupScreen';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { GameSpeedControl } from './components/TimeControl/GameSpeedControl';
import { DaysCounter } from './components/TimeControl/DaysCounter';
import { StatsPanel } from './components/StatsPanel/StatsPanel';
import { OrbitVisualization } from './components/GameBoard/OrbitVisualization';
import { DebrisChart } from './components/Charts/DebrisChart';
import { SatelliteChart } from './components/Charts/SatelliteChart';
import { DebrisRemovalChart } from './components/Charts/DebrisRemovalChart';
import { MissionPanel } from './components/MissionPanel/MissionPanel';
import { EventLog } from './components/EventLog/EventLog';
import { Tabs } from './components/ui/Tabs';
import { useGameSpeed } from './hooks/useGameSpeed';
import { useAppSelector } from './store/hooks';
import { GameOverModal } from './components/GameOver/GameOverModal';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const history = useAppSelector(state => state.game.history);
  const gameOver = useAppSelector(state => state.game.gameOver);

  useGameSpeed();

  if (!gameStarted) {
    return <GameSetupScreen onStart={() => setGameStarted(true)} />;
  }

  const tabs = [
    {
      id: 'launch',
      label: 'Launch',
      content: (
        <div className="flex gap-6 justify-center items-start">
          <div className="w-96">
            <ControlPanel />
          </div>
          <div className="flex flex-col gap-6">
            <OrbitVisualization />
            <GameSpeedControl />
          </div>
          <div className="w-96">
            <StatsPanel />
          </div>
        </div>
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <DebrisChart data={history} />
          <SatelliteChart data={history} />
          <DebrisRemovalChart data={history} />
        </div>
      ),
    },
    {
      id: 'missions',
      label: 'Missions',
      content: <MissionPanel />,
    },
    {
      id: 'events',
      label: 'Events',
      content: <EventLog />,
    },
    {
      id: 'documentation',
      label: 'Documentation',
      content: (
        <div className="text-center text-gray-400 py-12">
          Documentation coming soon...
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Space Debris Removal
          </h1>
        </header>

        <Tabs tabs={tabs} defaultTab="launch" rightContent={<DaysCounter />} />
      </div>

      {gameOver && <GameOverModal />}
    </div>
  );
}

export default App;
