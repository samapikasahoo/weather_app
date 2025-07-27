import axios from 'axios';
import type { GeoCode } from '../utils/types';

const BASE_URL = import.meta.env.VITE_BACKEND_CHOREO_URL;
const LOCATIONIQ_URL = import.meta.env.VITE_LOCATIONIQ_API_URL;
const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY;

export const fetchGeoCode = async (latitude: string, longitude: string): Promise<GeoCode> => {
  try {
    const response = await axios.get<GeoCode>(
      `${BASE_URL}reverseGeocode?lat=${latitude}&lon=${longitude}`,
    );
    console.log('Geolocation fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.data &&
      error.response.data.error
    ) {
      throw new Error(error.response.data.error.message);
    }
    throw new Error(`Error fetching geolocation data: ${(error as Error).message}`);
  }
};

export const fetchLocationSuggestions = async (query: string): Promise<GeoCode[]> => {
  try {
    const response = await axios.get<GeoCode[]>(
      `${LOCATIONIQ_URL}autocomplete?key=${LOCATIONIQ_API_KEY}&q=${query}&limit=5&dedupe=1`,
    );
    console.log('Location suggestions fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.data &&
      error.response.data.error
    ) {
      throw new Error(error.response.data.error.message);
    }
    throw new Error(`Error fetching location suggestions: ${(error as Error).message}`);
  }
};
