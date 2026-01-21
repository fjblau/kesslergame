import type { BrandConfig } from './brands/index';
import { defaultBrand } from './brands/default';
import { astroscaleBrand } from './brands/astroscale';

const brands: Record<string, BrandConfig> = {
  default: defaultBrand,
  astroscale: astroscaleBrand,
};

const brandId = import.meta.env.VITE_BRAND_ID || 'default';

console.log('🎨 Loading brand:', brandId);
console.log('📦 Available brands:', Object.keys(brands));

const selectedBrand = brands[brandId];

if (!selectedBrand) {
  console.error(`Brand "${brandId}" not found. Available brands:`, Object.keys(brands));
  throw new Error(`Invalid VITE_BRAND_ID: ${brandId}`);
}

console.log('✅ Brand loaded:', selectedBrand.name);

export const brand = selectedBrand;
