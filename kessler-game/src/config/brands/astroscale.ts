import type { BrandConfig } from './index';

export const astroscaleBrand: BrandConfig = {
  id: 'astroscale',
  name: 'Astroscale',
  
  colors: {
    primary: {
      50: '#f0f7ff',
      100: '#e3f0ff',
      200: '#cce4ff',
      300: '#a6d1fe',
      400: '#70b2fc',
      500: '#4d94f8',
      600: '#3b82f6',
      700: '#2563eb',
      800: '#1d4ed8',
      900: '#1e40af',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    background: {
      50: '#334155',
      100: '#1e293b',
      200: '#0f172a',
      300: '#0c1220',
      400: '#0a0f1c',
      500: '#080d18',
      600: '#060a14',
      700: '#040810',
      800: '#02050c',
      900: '#010308',
    },
  },
  
  assets: {
    logo: '/brands/astroscale/logo.png',
    favicon: '/brands/astroscale/favicon.png',
    certificateLogo: '/brands/astroscale/logo.png',
  },
  
  text: {
    appName: 'Astroscale',
    appTitle: 'Astroscale Orbital Management Simulator',
    certificateTitle: 'MISSION COMPLETE',
    certificateSubtitle: 'Astroscale - Space for Tomorrow',
    organizationName: 'Astroscale Holdings Inc. - On-Orbit Servicing Division',
  },
};
