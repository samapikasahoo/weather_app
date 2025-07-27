import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import WeatherCard from './WeatherCard';
import { LocationContext } from '../context/LocationContext';
import { SnackbarContext } from '../context/SnackbarContext';
import { fetchWeatherData, fetchCurrentWeatherSummary } from '../services/weatherApi';
import mockWeatherData from './__mocks__/weather-res.json';
import { vi, describe, test, expect, beforeEach } from 'vitest';

// Mock the API services
vi.mock('../services/weatherApi', () => ({
  fetchWeatherData: vi.fn(),
  fetchCurrentWeatherSummary: vi.fn(),
}));

// Mock data for tests
const mockLocation = {
  name: 'London',
  lat: 51.5074,
  lon: 0.1278,
  region: 'City of London, Greater London',
  country: 'United Kingdom',
  tz_id: 'Europe/London',
  localtime_epoch: 1687234567,
  localtime: '2023-06-20 09:15',
};

const mockWeatherSummary =
  'Cloudy with a chance of rain later in the day. Temperatures around 18°C.';

// Mock context providers
const renderWithProviders = (ui: React.ReactElement) => {
  const mockShowMessage = vi.fn();

  return render(
    <LocationContext.Provider value={{ location: mockLocation, setLocation: vi.fn() }}>
      <SnackbarContext.Provider value={{ showMessage: mockShowMessage }}>
        {ui}
      </SnackbarContext.Provider>
    </LocationContext.Provider>,
  );
};

describe('WeatherCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Update mock weather data with air quality for testing
    const weatherDataWithAirQuality = {
      ...mockWeatherData,
      current: {
        ...mockWeatherData.current,
        air_quality: {
          pm2_5: 15.5,
          co: 250,
          no2: 15,
          o3: 40,
          so2: 5,
          pm10: 25,
        },
      },
    };

    // Setup default mocks
    vi.mocked(fetchWeatherData).mockResolvedValue(weatherDataWithAirQuality);
    vi.mocked(fetchCurrentWeatherSummary).mockResolvedValue(mockWeatherSummary);
  });

  test('renders loading state initially', () => {
    renderWithProviders(<WeatherCard />);

    // MUI Skeletons don't have a standard test ID, so we'll check for specific loading state elements
    // The Skeletons in the WeatherCard component use variant="wave"
    const skeletonElements = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  test('displays weather data when loaded successfully', async () => {
    renderWithProviders(<WeatherCard />);

    // Wait for data to load and component to update
    await waitFor(() => {
      expect(screen.getByText(/Weather on London/i)).toBeInTheDocument();
    });

    // Check main weather info
    expect(screen.getByText('18.5')).toBeInTheDocument(); // Temperature
    expect(screen.getByText('Cloudy')).toBeInTheDocument(); // Condition
    // Check extra metrics
    expect(screen.getByText('19.8 kph')).toBeInTheDocument(); // Wind speed
    expect(screen.getByText('72%')).toBeInTheDocument(); // Humidity
    expect(screen.getByText('8 km')).toBeInTheDocument(); // Visibility
    expect(screen.getByText('1012.5 mb')).toBeInTheDocument(); // Pressure
    expect(screen.getByText('13.2°C')).toBeInTheDocument(); // Dew point

    // Check weather summary
    expect(screen.getByText(mockWeatherSummary)).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    // Mock API failure
    vi.mocked(fetchWeatherData).mockRejectedValue(new Error('Failed to fetch'));

    renderWithProviders(<WeatherCard />);

    await waitFor(() => {
      expect(screen.getByText(/Error fetching current weather data/i)).toBeInTheDocument();
    });
  });

  test('calculates and displays air quality correctly', async () => {
    // Mock data with different PM2.5 levels to test AQI calculation
    const weatherDataWithHighAirQuality = {
      ...mockWeatherData,
      current: {
        ...mockWeatherData.current,
        air_quality: {
          pm2_5: 5.0, // Should give a good AQI (green)
        },
      },
    };

    vi.mocked(fetchWeatherData).mockResolvedValue(weatherDataWithHighAirQuality);

    renderWithProviders(<WeatherCard />);

    await waitFor(() => {
      expect(screen.getByText(/Weather on London/i)).toBeInTheDocument();
    });

    // Find the air quality element by aria-label
    const airQualityElement = screen.getByLabelText(/Air quality index/i);
    expect(airQualityElement).toBeInTheDocument();

    // With PM2.5 of 5.0, the AQI should be in the "Good" range (0-50)
    const aqiValue = within(airQualityElement).getByText(/\d+/);
    expect(Number(aqiValue.textContent)).toBeLessThanOrEqual(50);

    // Check for the indicator icon
    const indicator = within(airQualityElement).getByTestId('FiberManualRecordIcon');
    expect(indicator).toBeInTheDocument();
  });

  test('updates when location changes', async () => {
    const { rerender } = renderWithProviders(<WeatherCard />);

    await waitFor(() => {
      expect(screen.getByText(/Weather on London/i)).toBeInTheDocument();
    });

    // Clear mocks to check if they get called with new location
    vi.clearAllMocks();

    // Change location
    const newLocation = {
      name: 'Paris',
      lat: 48.8566,
      lon: 2.3522,
      region: 'Ile-de-France',
      country: 'France',
      tz_id: 'Europe/Paris',
      localtime_epoch: 1687234567,
      localtime: '2023-06-20 10:15',
    };

    rerender(
      <LocationContext.Provider value={{ location: newLocation, setLocation: vi.fn() }}>
        <SnackbarContext.Provider value={{ showMessage: vi.fn() }}>
          <WeatherCard />
        </SnackbarContext.Provider>
      </LocationContext.Provider>,
    );

    // Check if API was called with new location and country
    await waitFor(() => {
      expect(fetchWeatherData).toHaveBeenCalledWith('Paris, France');
    });
  });
});
