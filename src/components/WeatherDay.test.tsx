import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect, vi } from 'vitest';
import WeatherDay from './WeatherDay';
import type { ForecastDay } from '../utils/types';
import mockForecastDayData from './__mocks__/forecastDay.json';
import type { WeatherHourProps } from './WeatherHourCard';

// Mock the WeatherHour component using Vitest's vi.mock
vi.mock('./WeatherHourCard', () => {
  return {
    default: (props: WeatherHourProps) => (
      <div data-testid="weather-hour" data-props={JSON.stringify(props)} />
    ),
  };
});

describe('WeatherDay Component', () => {
  // Type assertion to ensure TypeScript recognizes the imported JSON as ForecastDay
  const mockForecastDay = mockForecastDayData as ForecastDay;

  test('renders the formatted date correctly', () => {
    render(<WeatherDay {...mockForecastDay} />);
    expect(screen.getByText('Monday, May 1, 2023')).toBeInTheDocument();
  });

  test('renders correct number of WeatherHour components', () => {
    render(<WeatherDay {...mockForecastDay} />);
    const hourComponents = screen.getAllByTestId('weather-hour');
    expect(hourComponents).toHaveLength(mockForecastDay.hour.length);
  });

  test('passes correct props to WeatherHour components', () => {
    render(<WeatherDay {...mockForecastDay} />);
    const hourComponents = screen.getAllByTestId('weather-hour');

    hourComponents.forEach((component, index) => {
      const props = JSON.parse(component.getAttribute('data-props') || '{}');

      // Testing a few key props
      const hourTime = new Date(mockForecastDay.hour[index].time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      expect(props.hour).toBe(hourTime);
      expect(props.icon).toBe(mockForecastDay.hour[index].condition.icon);
      expect(props.temp_c).toBe(mockForecastDay.hour[index].temp_c);
      expect(props.condition).toBe(mockForecastDay.hour[index].condition.text);
    });
  });
});
