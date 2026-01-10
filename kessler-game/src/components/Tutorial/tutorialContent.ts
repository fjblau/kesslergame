export interface TutorialStepContent {
  title: string;
  description: string;
  points: string[];
}

export const TUTORIAL_STEPS: TutorialStepContent[] = [
  {
    title: 'Welcome to Space Debris Removal!',
    description: 'Learn how to manage Earth\'s orbital space and prevent catastrophic debris cascades.',
    points: [
      '🎯 Goal: Manage Earth\'s orbital space by launching satellites and removing debris',
      '⚠️ Challenge: Prevent Kessler Syndrome - a catastrophic debris cascade',
      '📊 Success Criteria: Maximize score through smart satellite launches, debris cleanup, and budget management',
      '⏱️ Duration: Survive as long as possible (max 100 turns)',
    ],
  },
  {
    title: 'Understanding the Game Interface',
    description: 'Familiarize yourself with the main UI sections and navigation.',
    points: [
      '🎮 Control Panel (Left): Launch satellites and Active Debris Removal (ADR) vehicles',
      '🌍 Orbit Visualization (Center): Watch objects orbit Earth in real-time across 4 layers (LEO/MEO/GEO/GRAVEYARD)',
      '📈 Stats Panel (Right): Monitor budget, debris count, collision risk, and event log',
      '📑 Navigation Tabs: Access Analytics, Missions, Configuration, and Documentation',
    ],
  },
  {
    title: 'How to Launch Satellites & ADR Vehicles',
    description: 'Learn how to deploy assets into orbit to generate revenue and manage debris.',
    points: [
      '🛰️ Satellites: Choose purpose (Weather/Comms/GPS), orbit (LEO/MEO/GEO), and insurance level - Generate revenue every turn based on type',
      '🚀 Cooperative ADR: Standard debris removal (2-3 pieces/turn) for cooperative debris',
      '🚀 Uncooperative ADR: High-capacity removal (6-9 pieces/turn) for difficult debris',
      '🚀 GeoTug: Move satellites to GRAVEYARD orbit to prevent future collisions',
      '🚀 Servicing Vehicle: Extend satellite/ADR lifespan by 50%',
    ],
  },
  {
    title: 'Managing Your Space Operations',
    description: 'Master the controls to effectively manage your orbital assets.',
    points: [
      '⏸️ Time Controls: Pause, Normal speed, or Fast forward (2s auto-advance)',
      '🎯 Monitor Debris: Watch debris levels - deploy ADR vehicles before cascade threshold (250 pieces)',
      '💰 Budget Management: Track income from satellites vs costs of launches and ADR operations',
      '⚡ Random Events: Solar storms can remove debris or damage satellites',
    ],
  },
  {
    title: 'Where to Find Help',
    description: 'Access resources and tips to succeed in your mission.',
    points: [
      '📖 Documentation Tab: Detailed guides on satellites, ADR vehicles, scoring, and game mechanics',
      '📊 Analytics Tab: Charts tracking debris, satellites, and removal operations over time',
      '🎯 Missions Tab: Complete objectives for bonus points and achievements',
      '⚙️ Configuration Tab: Customize game difficulty and mechanics',
      '💡 Pro Tip: Start with a few satellites to generate revenue, then deploy ADR vehicles proactively to manage debris before it cascades!',
    ],
  },
];
