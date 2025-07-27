import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import WeatherInputCard from './WeatherInputCard';
import { LocationContext } from '../context/LocationContext';
import { SnackbarContext } from '../context/SnackbarContext';
import { fetchWeatherData } from '../services/weatherApi';
import { fetchLocationSuggestions } from '../services/geoLocationApi';

// Mock the API services
vi.mock('../services/weatherApi');
vi.mock('../services/geoLocationApi');

// Mock context values
const mockSetLocation = vi.fn();
const mockShowMessage = vi.fn();

const mockLocation = {
  name: 'London',
  lat: 51.5074,
  lon: -0.1278,
  region: 'City of London, Greater London',
  country: 'United Kingdom',
  tz_id: 'Europe/London',
  localtime_epoch: 1633437855,
  localtime: '2021-10-05 12:30',
};

const mockWeatherData = {
  location: {
    name: 'London',
    lat: 51.5074,
    lon: -0.1278,
    region: 'City of London, Greater London',
    country: 'United Kingdom',
    tz_id: 'Europe/London',
    localtime_epoch: 1633437855,
    localtime: '2021-10-05 12:30',
  },
  current: {
    temp_c: 15,
    condition: {
      text: 'Partly cloudy',
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
    },
  },
};

// Mock location suggestions data
const mockLocationSuggestions = [
  {
    address: {
      name: 'London',
      country: 'United Kingdom',
      country_code: 'UK',
    },
  },
];

const renderComponent = () => {
  return render(
    <LocationContext.Provider value={{ location: mockLocation, setLocation: mockSetLocation }}>
      <SnackbarContext.Provider value={{ showMessage: mockShowMessage }}>
        <WeatherInputCard />
      </SnackbarContext.Provider>
    </LocationContext.Provider>,
  );
};

describe('WeatherInputCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Provide default mock implementations for all tests
    (fetchWeatherData as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockWeatherData);
    (fetchLocationSuggestions as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockLocationSuggestions,
    );
  });

  test('renders correctly', () => {
    renderComponent();
    expect(screen.getByText('Search Weather')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter Place')).toBeInTheDocument();
    expect(screen.getByText('Live Data')).toBeInTheDocument();
    expect(screen.getByText('7‑Day Forecast')).toBeInTheDocument();
  });

  test('fetches weather data when search button is clicked with valid input', async () => {
    (fetchWeatherData as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      mockWeatherData,
    );

    renderComponent();

    const input = screen.getByLabelText('Enter Place');
    fireEvent.change(input, { target: { value: 'London' } });

    // We need to set the place state directly before clicking the button
    // This simulates selecting an option from the Autocomplete
    fireEvent.keyDown(input, { key: 'Enter' });

    const searchButton = screen.getByText('Search Weather');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(fetchWeatherData).toHaveBeenCalled();
      expect(mockSetLocation).toHaveBeenCalledWith(mockWeatherData.location);
    });
  });

  test('shows error message when API call fails', async () => {
    const errorMsg = 'Failed to fetch weather data';
    (fetchWeatherData as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error(errorMsg),
    );

    renderComponent();

    const input = screen.getByLabelText('Enter Place');
    fireEvent.change(input, { target: { value: 'Invalid Location' } });

    // We need to set the place state directly before clicking the button
    fireEvent.keyDown(input, { key: 'Enter' });

    const searchButton = screen.getByText('Search Weather');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(fetchWeatherData).toHaveBeenCalled();
      expect(mockShowMessage).toHaveBeenCalledWith(`Error: ${errorMsg}`, 'error');
    });
  });

  test('handles location suggestions', async () => {
    renderComponent();

    const input = screen.getByLabelText('Enter Place');
    fireEvent.change(input, { target: { value: 'Lon' } });

    await waitFor(() => {
      expect(fetchLocationSuggestions).toHaveBeenCalledWith('Lon');
    });
  });
});
