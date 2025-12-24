import type { Satellite } from '../types';
import { INSURANCE_CONFIG } from '../constants';

export function calculateInsurancePayout(satellite: Satellite): number {
  return INSURANCE_CONFIG[satellite.insuranceTier].payout;
}

export function calculateTotalPayout(destroyedSatellites: Satellite[]): number {
  return destroyedSatellites.reduce((total, sat) => {
    return total + calculateInsurancePayout(sat);
  }, 0);
}
