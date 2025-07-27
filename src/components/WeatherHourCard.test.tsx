import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeatherHour from './WeatherHourCard';

describe('WeatherHour Component', () => {
  const mockProps = {
    hour: '12:00 PM',
    icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
    temp_c: 22.5,
    condition: 'Partly cloudy',
    feelslike_c: 21.8,
    wind_mph: 5.6,
    cloud: 25,
    visibility: '10 km',
    gust_mph: 7.8,
    humidity: 65,
    dewpoint_c: 15.7,
    pressure_in: 29.92,
    uv: 4.5,
  };

  it('renders the component with correct hour and condition', () => {
    render(<WeatherHour {...mockProps} />);

    // Check if the hour is displayed
    expect(screen.getByText('12:00 PM')).toBeInTheDocument();

    // Check if the condition is displayed
    expect(screen.getByText('Partly cloudy')).toBeInTheDocument();
  });

  it('displays the temperature correctly with rounding', () => {
    render(<WeatherHour {...mockProps} />);

    // Since there might be multiple temperature displays, we'll check that at least one has 23°C
    expect(screen.getAllByText('23°C').length).toBeGreaterThan(0);
  });

  it('renders the weather icon with correct source', () => {
    render(<WeatherHour {...mockProps} />);

    // Check if the icon is rendered with the correct src
    const icon = screen.getByAltText('Partly cloudy');
    expect(icon).toBeInTheDocument();
    expect(icon.getAttribute('src')).toBe('https://cdn.weatherapi.com/weather/64x64/day/116.png');
  });

  it('displays all weather details with correct values', () => {
    const { container } = render(<WeatherHour {...mockProps} />);

    // Using textContent to check for weather metrics in the component
    const contentText = container.textContent;

    // Check that the component text content includes all our weather metrics
    expect(contentText).toContain('5.6 mph'); // Wind
    expect(contentText).toContain('25%'); // Cloud cover
    expect(contentText).toContain('10 km'); // Visibility
    expect(contentText).toContain('7.8 mph'); // Wind gust
    expect(contentText).toContain('65%'); // Humidity
    expect(contentText).toContain('29.92 in'); // Pressure

    // For rounded values, we'll check explicitly
    expect(screen.getAllByText('22°C').length).toBeGreaterThan(0); // Feels like (rounded)
    expect(screen.getAllByText('16°C').length).toBeGreaterThan(0); // Dew point (rounded)
    expect(screen.getAllByText('5').length).toBeGreaterThan(0); // UV (rounded)
  });
});
