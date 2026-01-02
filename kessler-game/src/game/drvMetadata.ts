export interface DRVMetadata {
  vehicle_name: string;
  organization: string;
  capture_type: 'cooperative' | 'non-cooperative';
  capture_system: string;
  icon_suggestion: string;
}

export const DRV_METADATA: DRVMetadata[] = [
  {
    vehicle_name: 'ELSA-d Servicer',
    organization: 'Astroscale',
    capture_type: 'cooperative',
    capture_system: 'Magnetic capture mechanism that mates with ferromagnetic docking plate',
    icon_suggestion: 'Boxy spacecraft with magnetic disc',
  },
  {
    vehicle_name: 'ELSA-M',
    organization: 'Astroscale UK',
    capture_type: 'cooperative',
    capture_system: 'Magnetic docking; can service multiple satellites per mission',
    icon_suggestion: 'Multi-port magnetic servicer',
  },
  {
    vehicle_name: 'MEV-1',
    organization: 'Northrop Grumman',
    capture_type: 'cooperative',
    capture_system: 'Docking probe inserted into standard Liquid Apogee Engine nozzle',
    icon_suggestion: 'Cylindrical craft with central probe',
  },
  {
    vehicle_name: 'MEV-2',
    organization: 'Northrop Grumman',
    capture_type: 'cooperative',
    capture_system: 'Docking probe inserted into standard Liquid Apogee Engine nozzle',
    icon_suggestion: 'Cylindrical craft with central probe',
  },
  {
    vehicle_name: 'MRV (Mission Robotic Vehicle)',
    organization: 'Northrop Grumman',
    capture_type: 'cooperative',
    capture_system: 'Robotic arms for standardized interfaces',
    icon_suggestion: 'Spacecraft with folded robotic arms',
  },
  {
    vehicle_name: 'CAT (Capture Bay for ADR)',
    organization: 'GMV/ESA',
    capture_type: 'cooperative',
    capture_system: 'MICE mechanical interface designed for D4R-equipped satellites',
    icon_suggestion: 'Bay/dock shaped vehicle',
  },
  {
    vehicle_name: 'ClearSpace-1',
    organization: 'ClearSpace SA / ESA',
    capture_type: 'non-cooperative',
    capture_system: 'Four-armed robotic claw embrace capture',
    icon_suggestion: 'Four-armed grabber claw',
  },
  {
    vehicle_name: 'RemoveDEBRIS',
    organization: 'Surrey Space Centre',
    capture_type: 'non-cooperative',
    capture_system: 'Net launcher plus harpoon system',
    icon_suggestion: 'Spacecraft with net cannon and harpoon',
  },
  {
    vehicle_name: 'NASA ADRV',
    organization: 'NASA',
    capture_type: 'non-cooperative',
    capture_system: 'CARS robotic grappling for tumbling targets up to 25 deg/sec',
    icon_suggestion: 'Compact craft with articulated gripper',
  },
  {
    vehicle_name: 'ADRAS-J successor (CRD2 Phase II)',
    organization: 'Astroscale Japan / JAXA',
    capture_type: 'non-cooperative',
    capture_system: 'Robotic arm grappling',
    icon_suggestion: 'Single large robotic arm craft',
  },
  {
    vehicle_name: 'ROGER',
    organization: 'QinetiQ',
    capture_type: 'non-cooperative',
    capture_system: 'Telescopic rod with gripper',
    icon_suggestion: 'Extendable boom with pincer',
  },
  {
    vehicle_name: 'Dual-arm space robot',
    organization: 'DLR and others',
    capture_type: 'non-cooperative',
    capture_system: 'Contact-based detumbling via repeated robotic arm impacts',
    icon_suggestion: 'Humanoid dual-arm torso',
  },
  {
    vehicle_name: 'Sky Perfect JSAT Laser',
    organization: 'Sky Perfect JSAT',
    capture_type: 'non-cooperative',
    capture_system: 'Contactless laser ablation to alter debris trajectory',
    icon_suggestion: 'Dish/emitter with beam',
  },
];

const COOPERATIVE_DRVS = DRV_METADATA.filter(drv => drv.capture_type === 'cooperative');
const NON_COOPERATIVE_DRVS = DRV_METADATA.filter(drv => drv.capture_type === 'non-cooperative');

export function selectDRVMetadata(drvType: 'cooperative' | 'uncooperative'): DRVMetadata | undefined {
  const pool = drvType === 'cooperative' ? COOPERATIVE_DRVS : NON_COOPERATIVE_DRVS;
  
  if (pool.length === 0) {
    return undefined;
  }
  
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
