import type { Location } from './types';

export const defaultLocation: Location = {
  name: 'Colombo',
  region: 'Western',
  country: 'Sri Lanka',
  lat: 6.9319,
  lon: 79.8478,
  tz_id: 'Asia/Colombo',
  localtime_epoch: Math.floor(Date.now() / 1000),
  localtime: new Date().toISOString(),
};
