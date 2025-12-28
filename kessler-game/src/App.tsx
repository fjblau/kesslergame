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
        <div className="p-8 space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-blue-400 mb-4">Game Overview</h2>
            <p className="text-gray-300 mb-4">
              Space Debris Removal is a simulation game where you manage Earth's orbital space by launching satellites
              and deploying Debris Removal Vehicles (DRVs) to prevent catastrophic cascading collisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">Satellites</h2>
            <div className="space-y-4 text-gray-300">
              <p className="mb-4">Satellites are your primary assets in orbit. Each serves a specific purpose and contributes to your score.</p>
              
              <div className="ml-4 space-y-3">
                <div>
                  <h4 className="text-lg font-semibold text-purple-300">☁️ Weather Satellites</h4>
                  <p>Monitor atmospheric conditions, track storms, and provide climate data. Essential for meteorological services.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-purple-300">📡 Communication Satellites</h4>
                  <p>Enable global telecommunications, broadcast services, and internet connectivity. Critical infrastructure for modern society.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-purple-300">🛰️ GPS Satellites</h4>
                  <p>Provide positioning, navigation, and timing services. Used for mapping, transportation, and military applications.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-purple-300">🎲 Random Purpose (10% Discount)</h4>
                  <p>Let the system assign a random purpose. Receive a 10% launch cost discount for the flexibility.</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-purple-300 mb-2">Orbital Zones & Launch Costs</h4>
                <ul className="space-y-1">
                  <li><strong>LEO (Low Earth Orbit):</strong> $2M - Closest to Earth, higher collision risk</li>
                  <li><strong>MEO (Medium Earth Orbit):</strong> $3M - Moderate altitude, balanced risk</li>
                  <li><strong>GEO (Geostationary Orbit):</strong> $5M - Highest orbit, lower collision risk</li>
                </ul>
              </div>

              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-purple-300 mb-2">Insurance Options</h4>
                <ul className="space-y-1">
                  <li><strong>None:</strong> No cost, no payout if destroyed</li>
                  <li><strong>Basic:</strong> $500K cost, $1M payout if destroyed</li>
                  <li><strong>Premium:</strong> $1M cost, $2.5M payout if destroyed</li>
                </ul>
                <p className="text-sm text-gray-400 mt-2">Insurance helps mitigate financial losses from collisions and solar storms.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">Debris Removal Vehicles (DRVs)</h2>
            <div className="space-y-4 text-gray-300">
              <p className="mb-4">DRVs are specialized spacecraft designed to capture and remove space debris. Choose the right type based on the debris you need to clear.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Cooperative DRVs</h4>
                  <p className="mb-3">Designed for defunct satellites and larger, trackable debris that can be approached safely.</p>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Capacity:</strong> 2-3 debris pieces</li>
                    <li><strong>Success Rate:</strong> 85%</li>
                    <li><strong>Duration:</strong> 100 turns</li>
                    <li><strong>Costs:</strong></li>
                    <ul className="ml-4">
                      <li>LEO: $4M</li>
                      <li>MEO: $6M</li>
                      <li>GEO: $10M</li>
                    </ul>
                  </ul>
                  <p className="text-xs text-gray-400 mt-2">Best for: Predictable, larger debris with known trajectories</p>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg">
                  <h4 className="text-lg font-semibold text-orange-400 mb-2">Uncooperative DRVs</h4>
                  <p className="mb-3">Advanced systems for tumbling, uncontrolled debris and small fragments that are harder to capture.</p>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Capacity:</strong> 6-9 debris pieces</li>
                    <li><strong>Success Rate:</strong> 90%</li>
                    <li><strong>Duration:</strong> 100 turns</li>
                    <li><strong>Costs:</strong></li>
                    <ul className="ml-4">
                      <li>LEO: $7M</li>
                      <li>MEO: $10.5M</li>
                      <li>GEO: $17.5M</li>
                    </ul>
                  </ul>
                  <p className="text-xs text-gray-400 mt-2">Best for: Dangerous, unpredictable debris from collisions</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-purple-300 mb-2">Target Priority Strategies</h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Auto (Balanced):</strong> 70% cooperative / 30% uncooperative targeting
                    <span className="text-sm text-gray-400 block">Standard cost multiplier (1.0x)</span>
                  </li>
                  <li>
                    <strong>Cooperative-Focus:</strong> 90% cooperative / 10% uncooperative targeting
                    <span className="text-sm text-gray-400 block">10% cost discount (0.9x multiplier)</span>
                  </li>
                  <li>
                    <strong>Uncooperative-Focus:</strong> 10% cooperative / 90% uncooperative targeting
                    <span className="text-sm text-gray-400 block">20% cost premium (1.2x multiplier)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">How to Play</h2>
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-2">Managing Risk</h3>
                <p>Watch the collision risk indicator. High debris density increases the chance of collisions, which create more debris in a dangerous cascade. Deploy DRVs proactively when debris levels rise.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-2">Completing Missions</h3>
                <p>Complete missions to earn bonus points and unlock achievements. Missions vary from launching specific satellites to maintaining low debris levels.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-2">Budget Management</h3>
                <p>Balance spending between satellite launches, DRV deployments, and insurance. Monitor your income intervals and avoid running out of funds.</p>
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
        <div className="p-8 space-y-8">
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
