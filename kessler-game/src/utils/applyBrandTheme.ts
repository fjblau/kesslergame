import { brand } from '../config/brand';

export function applyBrandTheme(): void {
  const root = document.documentElement;
  
  Object.entries(brand.colors.primary).forEach(([key, value]) => {
    root.style.setProperty(`--color-cyber-cyan-${key}`, value);
  });
  
  Object.entries(brand.colors.success).forEach(([key, value]) => {
    root.style.setProperty(`--color-electric-green-${key}`, value);
  });
  
  Object.entries(brand.colors.warning).forEach(([key, value]) => {
    root.style.setProperty(`--color-neon-orange-${key}`, value);
  });
  
  Object.entries(brand.colors.background).forEach(([key, value]) => {
    root.style.setProperty(`--color-deep-space-${key}`, value);
  });
  
  root.style.setProperty('--color-primary', brand.colors.primary[500]);
  root.style.setProperty('--color-primary-dark', brand.colors.primary[600]);
  root.style.setProperty('--color-secondary', brand.colors.success[500]);
  root.style.setProperty('--color-secondary-dark', brand.colors.success[600]);
  root.style.setProperty('--color-accent', brand.colors.warning[500]);
  root.style.setProperty('--color-accent-dark', brand.colors.warning[600]);
  
  root.style.setProperty('--color-bg-base', brand.colors.background[500]);
  root.style.setProperty('--color-bg-surface', brand.colors.background[300]);
  root.style.setProperty('--color-bg-elevated', brand.colors.background[50]);
  
  document.title = brand.text.appTitle;
}
