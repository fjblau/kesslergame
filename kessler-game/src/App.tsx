import { useState, useEffect } from 'react';
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
import { playBackgroundMusic, stopAllSounds } from './utils/audio';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const history = useAppSelector(state => state.game.history);
  const gameOver = useAppSelector(state => state.game.gameOver);

  useGameSpeed();

  useEffect(() => {
    if (gameStarted && !gameOver) {
      playBackgroundMusic();
    } else if (gameOver) {
      stopAllSounds();
    }
  }, [gameStarted, gameOver]);

  useEffect(() => {
    return () => {
      stopAllSounds();
    };
  }, []);

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
        <div className="w-[80%] mx-auto grid grid-cols-3 gap-6">
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
        <div className="p-8 space-y-8 max-w-[1500px] mx-auto">
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
                    <li><strong>Duration:</strong> 10 turns</li>
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
                    <li><strong>Duration:</strong> 10 turns</li>
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

              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-purple-300 mb-2">DRV Lifecycle</h4>
                <p className="text-sm">After 10 turns of operation, DRVs are automatically decommissioned and completely removed from orbit. They do not become debris—they safely deorbit and burn up in the atmosphere.</p>
                <p className="text-sm text-gray-400 mt-2">Plan your DRV deployments strategically to ensure continuous debris removal coverage.</p>
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
                <h3 className="text-xl font-semibold text-purple-400 mb-2">Budget Management & Revenue</h3>
                <p>Your budget is the lifeblood of your operations. Each satellite launch, DRV deployment, and insurance purchase costs money.</p>
                
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-purple-300 mb-2">Satellite Revenue (Per Turn)</h4>
                  <p className="mb-2 text-sm">Each active satellite generates revenue every turn based on its type:</p>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>☁️ <strong className="text-blue-300">Weather:</strong> $100,000 per turn</li>
                    <li>📡 <strong className="text-green-300">Communications:</strong> $150,000 per turn</li>
                    <li>🛰️ <strong className="text-yellow-300">GPS:</strong> $200,000 per turn</li>
                  </ul>
                  <p className="mt-2 text-xs text-gray-400">Example: 5 Weather + 3 Comms + 2 GPS satellites = $1.35M revenue per turn</p>
                </div>

                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <h4 className="font-semibold text-purple-300 mb-2">Bonus Income (Difficulty-Based)</h4>
                  <p className="mb-2 text-sm">In addition to satellite revenue, you receive periodic bonus income based on difficulty:</p>
                  <div className="space-y-2 ml-4">
                    <div className="text-sm">
                      <strong className="text-green-400">Easy Mode:</strong> $10M bonus every 10 turns
                    </div>
                    <div className="text-sm">
                      <strong className="text-blue-400">Normal Mode:</strong> $5M bonus every 20 turns
                    </div>
                    <div className="text-sm">
                      <strong className="text-orange-400">Hard Mode:</strong> No bonus income
                    </div>
                    <div className="text-sm">
                      <strong className="text-red-400">Challenge Mode:</strong> No bonus income + $2M drain per turn
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-400">
                  <strong>Strategy tips:</strong> Launch high-value GPS satellites early to build steady income. In Easy/Normal modes, time expensive launches after bonus income arrives. Your satellite fleet is your primary revenue source—protect it with insurance and debris removal!
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">Game Timing & Progression</h2>
            <div className="space-y-4 text-gray-300">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-purple-300 mb-2">Days vs. Turns</h4>
                <ul className="space-y-2">
                  <li><strong>Days:</strong> Simulated time that advances every second when the game is not paused. Used for tracking mission progress and time-based objectives.</li>
                  <li><strong>Turns:</strong> Game simulation steps where actions occur (collisions, debris removal, DRV operations). The game consists of up to 100 turns.</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-purple-300 mb-2">Simulation Speed</h4>
                <ul className="space-y-2">
                  <li><strong>Paused:</strong> No turns advance, but you can still configure launches</li>
                  <li><strong>Normal:</strong> Turns advance every 4 seconds (base speed)</li>
                  <li><strong>Fast:</strong> Turns advance every 2 seconds (base speed)</li>
                </ul>
                <p className="text-sm text-gray-400 mt-3">
                  <strong>Risk-Based Speed Adjustment:</strong> Turn speed is modified by collision risk level:
                </p>
                <ul className="text-sm space-y-1 mt-2">
                  <li>• <span className="text-green-400">LOW Risk:</span> 1.0x multiplier (normal speed)</li>
                  <li>• <span className="text-yellow-400">MEDIUM Risk:</span> 1.5x multiplier (50% slower turns)</li>
                  <li>• <span className="text-red-400">CRITICAL Risk:</span> 2.0x multiplier (turns take twice as long)</li>
                </ul>
                <p className="text-sm text-gray-400 mt-2">This gives you more time to react during high-risk situations.</p>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-purple-300 mb-2">Auto-Pause Options</h4>
                <p className="mb-2">Configure automatic pausing when important events occur:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Pause on collision detected</li>
                  <li>• Pause when risk level changes</li>
                  <li>• Pause when budget drops below $20M</li>
                  <li>• Pause on mission completion</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">Analytics Tab</h2>
            <div className="space-y-4 text-gray-300">
              <p className="mb-4">The Analytics tab provides three time-series charts to help you track the simulation's progress and identify trends.</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h4 className="text-lg font-semibold text-red-400 mb-2">Debris Count Chart</h4>
                  <p className="text-sm">Tracks the total number of debris pieces in orbit over time. Watch for exponential growth that signals the onset of Kessler Syndrome.</p>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg">
                  <h4 className="text-lg font-semibold text-blue-400 mb-2">Satellite Count Chart</h4>
                  <p className="text-sm">Shows your active satellite population. Declining numbers indicate collisions or solar storm impacts affecting your assets.</p>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Debris Removal Chart</h4>
                  <p className="text-sm">Displays cumulative debris removed and active DRV count. Use this to assess the effectiveness of your cleanup efforts.</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-purple-300 mb-2">Using Analytics Effectively</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Compare debris growth rate vs. removal rate to gauge if you're winning or losing</li>
                  <li>• Identify patterns before and after major events (collisions, solar storms)</li>
                  <li>• Track satellite losses to optimize insurance strategies</li>
                  <li>• Monitor DRV performance to adjust deployment timing and quantities</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">Game Mechanics</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li><strong>Resources:</strong> Budget and launch capacity limit your actions</li>
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
        <div className="p-8 space-y-8 max-w-[1500px] mx-auto">
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

          <section>
            <h2 className="text-2xl font-bold text-blue-400 mb-3">Learn More</h2>
            <p className="text-gray-300 mb-4">
              Explore these authoritative sources to learn more about space debris and Kessler Syndrome:
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-purple-300 mb-2">Space Agencies & Organizations</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <a href="https://www.nasa.gov/mission_pages/station/news/orbital_debris.html" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-400 hover:text-blue-300 underline">
                      NASA Orbital Debris Program Office
                    </a>
                    {' '}- Official NASA resource on space debris tracking and mitigation
                  </li>
                  <li>
                    <a href="https://www.esa.int/Safety_Security/Space_Debris" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-400 hover:text-blue-300 underline">
                      ESA Space Debris Office
                    </a>
                    {' '}- European Space Agency's space debris research and initiatives
                  </li>
                  <li>
                    <a href="https://www.unoosa.org/oosa/en/ourwork/topics/space-debris/index.html" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-400 hover:text-blue-300 underline">
                      UN Office for Outer Space Affairs
                    </a>
                    {' '}- International guidelines and space debris mitigation policies
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-purple-300 mb-2">Real-Time Tracking & Data</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <a href="https://www.space-track.org/" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-400 hover:text-blue-300 underline">
                      Space-Track.org
                    </a>
                    {' '}- Track satellites and debris in real-time (free registration required)
                  </li>
                  <li>
                    <a href="https://platform.leolabs.space/visualization" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-400 hover:text-blue-300 underline">
                      LeoLabs Visualization Platform
                    </a>
                    {' '}- Interactive visualization of objects in low Earth orbit
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-purple-300 mb-2">Research & Academic Resources</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <a href="https://doi.org/10.1016/0021-9169(78)90057-1" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-400 hover:text-blue-300 underline">
                      Original Kessler Syndrome Paper (1978)
                    </a>
                    {' '}- Donald J. Kessler's foundational research on collision cascading
                  </li>
                  <li>
                    <a href="https://www.esa.int/ESA_Multimedia/Images/2023/11/Distribution_of_space_debris_in_orbit" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-400 hover:text-blue-300 underline">
                      ESA Space Debris Distribution Maps
                    </a>
                    {' '}- Visual data on current debris populations by altitude
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-purple-300 mb-2">Active Debris Removal Missions</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <a href="https://clearspace.today/" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-400 hover:text-blue-300 underline">
                      ClearSpace-1
                    </a>
                    {' '}- ESA's first debris removal mission (planned for 2026)
                  </li>
                  <li>
                    <a href="https://astroscale.com/missions/" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-400 hover:text-blue-300 underline">
                      Astroscale ELSA-d
                    </a>
                    {' '}- Demonstration of magnetic capture technology for debris removal
                  </li>
                  <li>
                    <a href="https://www.removerisdebris.space/" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-blue-400 hover:text-blue-300 underline">
                      RemoveDEBRIS Mission
                    </a>
                    {' '}- UK-led project testing net capture, harpoon, and vision-based navigation
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-700 pt-6">
            <h2 className="text-2xl font-bold text-blue-400 mb-3">Credits</h2>
            <p className="text-gray-300 mb-3">
              This application was written by <strong>Frank Blau</strong>, <strong>Tim Quick</strong>, and{' '}
              <strong>Gallya Todorova</strong> for the EIIS Space Entrepreneurship Master's Program. Thanks to{' '}
              <strong>Elias Ladinek</strong> for helping with the testing.
            </p>
            <p className="text-gray-400 text-sm">
              Licensed under the MIT License. See LICENSE file for details.
            </p>
            <p className="text-gray-400 text-sm mt-3">
              Thanks to Elias Ladinek for helping with the testing.
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
