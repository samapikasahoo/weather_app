import React, { useState, useMemo, useCallback, useEffect, useContext } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import WeatherDay from './WeatherDay';
import type { ForecastDay, ForecastResponse } from '../utils/types';
import { fetchWeatherForecast } from '../services/weatherApi';
import { LocationContext } from '../context/LocationContext';
import Skeleton from '@mui/material/Skeleton';
import ErrorMessage from './ErrorMessage';
import { SnackbarContext } from '../context/SnackbarContext';
import type { Location } from '../utils/types';
import { defaultLocation } from '../utils/constants';

interface FormattedDate {
  short: string;
  full: string;
}

const WeatherWeek: React.FC = () => {
  const [weatherData, setWeatherData] = useState<ForecastResponse | null>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const { location } = useContext(LocationContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showMessage } = useContext(SnackbarContext);

  useEffect(() => {
    const fetchWeather = async (location: Location) => {
      try {
        const weatherData = await fetchWeatherForecast(
          location.name ? location.name : defaultLocation.name,
        );
        setWeatherData(weatherData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('Error fetching weather data:', error);
        setError(error);
        showMessage('Error fetching forecasting responses.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchWeather(location);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.name]);

  // Memoize forecast days and formatted dates
  const { forecastDays, formattedDates } = useMemo(() => {
    if (!weatherData) return { forecastDays: [], formattedDates: [] };

    const days = weatherData.forecast.forecastday.slice(0, 7) as ForecastDay[];
    const dates = days.map((day): FormattedDate => {
      const date = new Date(day.date);
      return {
        short: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        full: date.toLocaleDateString(),
      };
    });

    return { forecastDays: days, formattedDates: dates };
  }, [weatherData]);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  }, []);

  const selectedDay = forecastDays[selectedTab];

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 3 }}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height={48}
          sx={{
            bgcolor: 'transparent',
            backgroundImage:
              'linear-gradient(90deg, rgba(135, 206, 235, 0.3) 0%, rgba(176, 224, 255, 0.2) 100%)',
            borderRadius: 3,
            '&::after': {
              background:
                'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            },
          }}
        />
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="25%"
            height={400}
            sx={{
              minWidth: 200,
              m: 2,
              bgcolor: 'transparent',
              backgroundImage:
                'linear-gradient(135deg, rgba(135, 206, 235, 0.15) 0%, rgba(176, 224, 255, 0.1) 100%)',
              borderRadius: 3,
              '&::after': {
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              },
            }}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="25%"
            height={400}
            sx={{
              minWidth: 200,
              m: 2,
              bgcolor: 'transparent',
              backgroundImage:
                'linear-gradient(135deg, rgba(135, 206, 235, 0.15) 0%, rgba(176, 224, 255, 0.1) 100%)',
              borderRadius: 3,
              '&::after': {
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              },
            }}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="25%"
            height={400}
            sx={{
              minWidth: 200,
              m: 2,
              bgcolor: 'transparent',
              backgroundImage:
                'linear-gradient(135deg, rgba(135, 206, 235, 0.15) 0%, rgba(176, 224, 255, 0.1) 100%)',
              borderRadius: 3,
              '&::after': {
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              },
            }}
          />
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="25%"
            height={400}
            sx={{
              minWidth: 200,
              m: 2,
              bgcolor: 'transparent',
              backgroundImage:
                'linear-gradient(135deg, rgba(135, 206, 235, 0.15) 0%, rgba(176, 224, 255, 0.1) 100%)',
              borderRadius: 3,
              '&::after': {
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
              },
            }}
          />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          width: '100%',
          mt: 3,
          background:
            'linear-gradient(135deg, rgba(176, 224, 255, 0.1) 0%, rgba(225, 245, 254, 0.1) 100%)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(176, 224, 255, 0.2)',
          boxShadow: '0 4px 20px rgba(15, 76, 117, 0.08)',
          height: '100px',
          color: '#fff',
          p: 2,
          textAlign: 'center',
        }}
      >
        <ErrorMessage message="Failed to fetch forecast weather data. Please check your internet connection or try again later." />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Box
        sx={{
          width: '100%',
          borderRadius: 3,
          background:
            'linear-gradient(135deg, rgba(135, 206, 235, 0.2) 0%, rgba(176, 224, 255, 0.15) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(176, 224, 255, 0.3)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(15, 76, 117, 0.1)',
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="Weather forecast tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-flexContainer': {
              gap: 0.5,
            },
            '& .MuiTab-root': {
              minWidth: 100,
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'none',
              color: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(176, 224, 255, 0.2)',
                color: 'white',
              },
              '&.Mui-selected': {
                color: 'white',
                backgroundColor: 'rgba(135, 206, 235, 0.3)',
                fontWeight: 600,
              },
            },
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(90deg, #87ceeb 0%, #b0e0ff 100%)',
              height: 3,
              borderRadius: '2px 2px 0 0',
            },
            '& .MuiTabs-scrollButtons': {
              color: 'rgba(176, 224, 255, 0.8)',
              '&.Mui-disabled': {
                opacity: 0.3,
              },
            },
          }}
        >
          {formattedDates.map((dateInfo, index) => (
            <Tab
              key={forecastDays[index].date}
              label={dateInfo.short}
              title={dateInfo.full}
              id={`weather-tab-${index}`}
              aria-controls={`weather-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      <Box
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 3,
          background:
            'linear-gradient(135deg, rgba(176, 224, 255, 0.1) 0%, rgba(225, 245, 254, 0.1) 100%)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(176, 224, 255, 0.2)',
          boxShadow: '0 4px 20px rgba(15, 76, 117, 0.08)',
        }}
        role="tabpanel"
        id={`weather-tabpanel-${selectedTab}`}
        aria-labelledby={`weather-tab-${selectedTab}`}
      >
        {selectedDay && (
          <WeatherDay
            key={selectedDay.date}
            date={selectedDay.date}
            hour={selectedDay.hour}
            date_epoch={selectedDay.date_epoch}
            day={selectedDay.day}
            astro={selectedDay.astro}
          />
        )}
      </Box>
    </Box>
  );
};

export default WeatherWeek;
