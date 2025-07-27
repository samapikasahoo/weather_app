import React, { createContext } from 'react';
import type { Location } from '../utils/types';
import { defaultLocation } from '../utils/constants';

type LocationContextProps = {
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
};

export const LocationContext = createContext<LocationContextProps>({
  location: defaultLocation,
  setLocation: () => {},
});
