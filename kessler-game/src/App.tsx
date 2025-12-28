import { useState } from 'react';
import { GameSetupScreen } from './components/Setup/GameSetupScreen';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { GameSpeedControl } from './components/TimeControl/GameSpeedControl';
import { StatsPanel } from './components/StatsPanel/StatsPanel';
import { OrbitVisualization } from './components/GameBoard/OrbitVisualization';
import { DebrisChart } from './components/Charts/DebrisChart';
import { SatelliteChart } from './components/Charts/SatelliteChart';
import { DebrisRemovalChart } from './components/Charts/DebrisRemovalChart';
import { MissionPanel } from './components/MissionPanel/MissionPanel';
import { EventLog } from './components/EventLog/EventLog';
import { CollisionSettings } from './components/Configuration/CollisionSettings';
import { OrbitalSpeedSettings } from './components/Configuration/OrbitalSpeedSettings';
import { SolarStormSettings } from './components/Configuration/SolarStormSettings';
import { DRVSettings } from './components/Configuration/DRVSettings';
import { RiskBasedSpeedSettings } from './components/Configuration/RiskBasedSpeedSettings';
import { Tabs } from './components/ui/Tabs';
import { useGameSpeed } from './hooks/useGameSpeed';
import { useAppSelector } from './store/hooks';
import { GameOverModal } from './components/GameOver/GameOverModal';
import { ScoreDisplay } from './components/Score/ScoreDisplay';

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
          <div className="w-[600px] flex flex-col">
            <ControlPanel />
          </div>
          <div className="flex flex-col gap-6">
            <OrbitVisualization />
            <GameSpeedControl />
          </div>
          <div className="w-[600px] flex flex-col gap-6 h-full">
            <StatsPanel />
            <EventLog />
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
      id: 'configuration',
      label: 'Configuration',
      content: (
        <div className="max-w-4xl mx-auto space-y-6">
          <CollisionSettings />
          <OrbitalSpeedSettings />
          <SolarStormSettings />
          <RiskBasedSpeedSettings />
          <DRVSettings />
        </div>
      ),
    },
    {
      id: 'documentation',
      label: 'Documentation',
      content: (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-blue-400 mb-4">Game Overview</h2>
            <p className="text-gray-300 mb-4">
              Space Debris Removal is a simulation game where you manage Earth's orbital space by launching satellites
              and deploying Debris Removal Vehicles (DRVs) to prevent catastrophic cascading collisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">How to Play</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-2">Launching Satellites</h3>
                <p>Configure and launch satellites into different orbital zones (LEO, MEO, GEO). Each satellite serves a purpose and contributes to your score.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-2">Deploying DRVs</h3>
                <p>Deploy Debris Removal Vehicles to clean up space debris before collisions occur. Monitor debris levels and act strategically.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-2">Managing Risk</h3>
                <p>Watch the collision risk indicator. High debris density increases the chance of collisions, which create more debris in a dangerous cascade.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-2">Completing Missions</h3>
                <p>Complete missions to earn bonus points and unlock achievements. Missions vary from launching specific satellites to maintaining low debris levels.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">Game Mechanics</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>Resources:</strong> Budget and launch capacity limit your actions</li>
              <li><strong>Time Control:</strong> Adjust simulation speed to plan strategically</li>
              <li><strong>Events:</strong> Random events like solar storms can affect your satellites</li>
              <li><strong>Scoring:</strong> Earn points through successful launches, debris removal, and mission completion</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">Tips for Success</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Balance satellite launches with debris removal efforts</li>
              <li>Monitor the Analytics tab to track trends</li>
              <li>Deploy DRVs proactively before debris levels become critical</li>
              <li>Complete missions early for maximum score bonuses</li>
              <li>Use the Configuration tab to adjust difficulty settings</li>
            </ul>
          </section>
        </div>
      ),
    },
    {
      id: 'about',
      label: 'About',
      content: (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-blue-400 mb-4">About Kessler Syndrome</h2>
            <p className="text-gray-300 mb-4">
              The Kessler Syndrome, proposed by NASA scientist Donald J. Kessler in 1978, describes a catastrophic 
              scenario where the density of objects in low Earth orbit (LEO) becomes high enough that collisions 
              between objects create a cascade effect. Each collision generates more debris, which causes more 
              collisions, exponentially increasing the amount of space debris.
            </p>
            <p className="text-gray-300 mb-4">
              This chain reaction could render space activities and the use of satellites in specific orbital ranges 
              impractical for many generations. As our reliance on satellite technology grows—for communications, 
              GPS, weather monitoring, and scientific research—the threat of Kessler Syndrome becomes increasingly 
              serious.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">Current State of Space Debris</h2>
            <p className="text-gray-300 mb-4">
              As of 2024, there are millions of pieces of space debris orbiting Earth:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
              <li>Over 34,000 objects larger than 10 cm being tracked</li>
              <li>Approximately 900,000 objects between 1-10 cm</li>
              <li>More than 130 million objects smaller than 1 cm</li>
            </ul>
            <p className="text-gray-300">
              These objects travel at speeds up to 28,000 km/h (17,500 mph), making even small pieces potentially 
              devastating to operational satellites and spacecraft.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">Space Debris Removal</h2>
            <p className="text-gray-300 mb-4">
              Active debris removal (ADR) is crucial for the long-term sustainability of space activities. Several 
              methods are being developed:
            </p>
            <div className="space-y-3 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-purple-400">Robotic Arms & Nets</h3>
                <p>Spacecraft equipped with robotic arms or nets can capture larger debris objects and de-orbit them.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-400">Harpoons</h3>
                <p>Harpoon systems can pierce and capture defunct satellites or large debris pieces.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-400">Laser Systems</h3>
                <p>Ground-based or space-based lasers can nudge debris into lower orbits where they burn up in the atmosphere.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-400">Electrodynamic Tethers</h3>
                <p>Long conductive tethers can generate drag to de-orbit debris or use electromagnetic forces for capture.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">The Future of Orbital Space</h2>
            <p className="text-gray-300">
              International cooperation and responsible space practices are essential. This includes designing satellites 
              to de-orbit after their mission, implementing "design for demise" principles, and developing effective 
              debris removal technologies. Games like this one help raise awareness about the importance of maintaining 
              a sustainable orbital environment for future generations.
            </p>
          </section>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-[2350px] mx-auto space-y-6">
        <header className="relative text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Space Debris Removal
          </h1>
          <div className="absolute right-0 top-0">
            <ScoreDisplay />
          </div>
        </header>

        <Tabs tabs={tabs} defaultTab="launch" />
      </div>

      {gameOver && <GameOverModal />}
    </div>
  );
}

export default App;
