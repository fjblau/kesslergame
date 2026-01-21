import type { BrandConfig } from './index';

export const defaultBrand: BrandConfig = {
  id: 'default',
  name: 'Space Debris Management',
  
  colors: {
    primary: {
      50: '#e6f9ff',
      100: '#b3edff',
      200: '#80e1ff',
      300: '#4dd5ff',
      400: '#1ac9ff',
      500: '#00d9ff',
      600: '#00b8d4',
      700: '#0097a9',
      800: '#00767f',
      900: '#005554',
    },
    success: {
      50: '#e6fff5',
      100: '#b3ffe0',
      200: '#80ffcb',
      300: '#4dffb6',
      400: '#1affa1',
      500: '#00ff88',
      600: '#00cc6a',
      700: '#00994d',
      800: '#006630',
      900: '#003318',
    },
    warning: {
      50: '#fff3ed',
      100: '#ffdcc8',
      200: '#ffc5a3',
      300: '#ffae7e',
      400: '#ff9759',
      500: '#ff6b35',
      600: '#ff4500',
      700: '#cc3700',
      800: '#992900',
      900: '#661b00',
    },
    background: {
      50: '#2d3548',
      100: '#252b3d',
      200: '#1f2433',
      300: '#1a1f2e',
      400: '#151922',
      500: '#0a0e1a',
      600: '#080c15',
      700: '#060910',
      800: '#04070b',
      900: '#020406',
    },
  },
  
  assets: {
    logo: '/brands/default/logo.png',
    favicon: '/vite.svg',
    certificateLogo: '/brands/default/logo.png',
  },
  
  text: {
    appName: 'Space Debris Management',
    appTitle: 'Kessler Game - Space Debris Management',
    certificateTitle: 'MISSION COMPLETE',
    certificateSubtitle: 'Space Debris Removal Certificate',
    organizationName: 'Space Debris Management Program - Earth Orbital Safety Division',
  },
};
