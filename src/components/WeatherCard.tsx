import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Stack, Tooltip, Chip } from '@mui/material';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CompressIcon from '@mui/icons-material/Compress';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import RefreshIcon from '@mui/icons-material/Refresh';
import FiberMannualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { fetchWeatherData, fetchCurrentWeatherSummary } from '../services/weatherApi';
import type { WeatherResponse } from '../utils/types';
import { LocationContext } from '../context/LocationContext';
import type { Location } from '../utils/types';
import { defaultLocation } from '../utils/constants';
import Skeleton from '@mui/material/Skeleton';
import { SnackbarContext } from '../context/SnackbarContext';
import ErrorMessage from './ErrorMessage';

const WeatherCard: React.FC = () => {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [currWeatherSummary, setCurrWeatherSummary] = useState<string | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [refreshingWeather, setRefreshingWeather] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { location } = useContext(LocationContext);
  const temperatureUnit = 'C';
  const [airQuality, setAirQuality] = useState<number>(0);
  const { showMessage } = useContext(SnackbarContext);

  console.log('Current location from context:', location);

  const getWeather = async (location: Location) => {
    try {
      const currentWeatherData = await fetchWeatherData(
        location.name
          ? `${location.name}, ${location.country}`
          : `${defaultLocation.name}, ${defaultLocation.country}`,
      );
      setWeather(currentWeatherData);
      setRefreshingWeather(false);

      // Calculate air quality index based on PM2.5
      const pm25 = currentWeatherData.current.air_quality.pm2_5 ?? 0;
      setAirQuality(calculateAQI_PM25(pm25));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err);
      showMessage(`Error fetching current weather data`, 'error');
    } finally {
      setLoadingWeather(false);
    }
  };

  const getCurrentSummary = async (location: Location) => {
    try {
      const currentWeatherSummary = await fetchCurrentWeatherSummary(
        location.name
          ? `${location.name}, ${location.country}`
          : `${defaultLocation.name}, ${defaultLocation.country}`,
      );
      setCurrWeatherSummary(currentWeatherSummary);
    } catch (err) {
      console.error('Error fetching current weather summary:', err);
      showMessage(`Error fetching current weather summary: ${err}`, 'error');
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    getWeather(location);
    getCurrentSummary(location);

    const interval = setInterval(
      () => {
        setRefreshingWeather(true);
        Promise.all([getWeather(location), getCurrentSummary(location)]).finally(() => {
          setRefreshingWeather(false);
        });
      },
      5 * 60 * 1000,
    ); // Refresh every 5 minutes

    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.name]);

  function calculateAQI_PM25(pm25: number): number {
    const breakpoints = [
      { AQI_low: 0, AQI_high: 50, PM_low: 0.0, PM_high: 12.0 },
      { AQI_low: 51, AQI_high: 100, PM_low: 12.1, PM_high: 35.4 },
      { AQI_low: 101, AQI_high: 150, PM_low: 35.5, PM_high: 55.4 },
      { AQI_low: 151, AQI_high: 200, PM_low: 55.5, PM_high: 150.4 },
      { AQI_low: 201, AQI_high: 300, PM_low: 150.5, PM_high: 250.4 },
      { AQI_low: 301, AQI_high: 400, PM_low: 250.5, PM_high: 350.4 },
      { AQI_low: 401, AQI_high: 500, PM_low: 350.5, PM_high: 500.4 },
    ];

    for (const bp of breakpoints) {
      if (pm25 >= bp.PM_low && pm25 <= bp.PM_high) {
        const aqi =
          ((bp.AQI_high - bp.AQI_low) / (bp.PM_high - bp.PM_low)) * (pm25 - bp.PM_low) + bp.AQI_low;
        return Math.round(aqi);
      }
    }

    return -1;
  }

  if (loadingWeather) {
    return (
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(58, 75, 106, 0.8), rgba(74, 90, 120, 0.5))',
          color: '#fff',
          borderRadius: 2,
          p: { xs: 1, sm: 2 },
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          width: '100%',
        }}
      >
        {/* Header Skeleton (Location + Time + Refresh) */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
          mb={2}
        >
          <Box>
            <Skeleton
              animation="wave"
              variant="text"
              width={120}
              height={20}
              sx={{
                mb: 1,
                borderRadius: 1,
                backgroundImage:
                  'linear-gradient(90deg, rgba(135, 206, 235, 0.3) 0%, rgba(176, 224, 255, 0.2) 100%)',
                '&::after': {
                  background:
                    'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                },
              }}
            />
            <Skeleton
              animation="wave"
              variant="text"
              width={80}
              height={16}
              sx={{
                borderRadius: 1,
                backgroundImage:
                  'linear-gradient(90deg, rgba(135, 206, 235, 0.3) 0%, rgba(176, 224, 255, 0.2) 100%)',
                '&::after': {
                  background:
                    'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                },
              }}
            />
          </Box>
          <Skeleton
            animation="wave"
            variant="rounded"
            width={80}
            height={32}
            sx={{
              borderRadius: 2,
              backgroundImage:
                'linear-gradient(90deg, rgba(135, 206, 235, 0.3) 0%, rgba(176, 224, 255, 0.2) 100%)',
              '&::after': {
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              },
            }}
          />
        </Box>

        {/* Main Weather Info Skeleton */}
        <Box display="flex" alignItems="center" flexDirection="row" gap={2} mb={3} ml={1}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={48}
            height={48}
            sx={{
              backgroundImage:
                'linear-gradient(90deg, rgba(135, 206, 235, 0.3) 0%, rgba(176, 224, 255, 0.2) 100%)',
              '&::after': {
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              },
            }}
          />
          <Box display="flex" alignItems="flex-end">
            <Skeleton
              animation="wave"
              variant="text"
              width={60}
              height={48}
              sx={{
                borderRadius: 1,
                mr: 1,
                backgroundImage:
                  'linear-gradient(90deg, rgba(135, 206, 235, 0.3) 0%, rgba(176, 224, 255, 0.2) 100%)',
                '&::after': {
                  background:
                    'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                },
              }}
            />
            <Skeleton
              animation="wave"
              variant="text"
              width={30}
              height={32}
              sx={{
                borderRadius: 1,
                backgroundImage:
                  'linear-gradient(90deg, rgba(135, 206, 235, 0.3) 0%, rgba(176, 224, 255, 0.2) 100%)',
                '&::after': {
                  background:
                    'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                },
              }}
            />
          </Box>
          <Box>
            <Skeleton
              animation="wave"
              variant="text"
              width={100}
              height={20}
              sx={{
                mb: 1,
                borderRadius: 1,
                backgroundImage:
                  'linear-gradient(90deg, rgba(135, 206, 235, 0.3) 0%, rgba(176, 224, 255, 0.2) 100%)',
                '&::after': {
                  background:
                    'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                },
              }}
            />
            <Skeleton
              animation="wave"
              variant="text"
              width={120}
              height={16}
              sx={{
                borderRadius: 1,
                backgroundImage:
                  'linear-gradient(90deg, rgba(135, 206, 235, 0.3) 0%, rgba(176, 224, 255, 0.2) 100%)',
                '&::after': {
                  background:
                    'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                },
              }}
            />
          </Box>
        </Box>

        {/* Extra Metrics Skeletons */}
        <Skeleton
          animation="wave"
          variant="rectangular"
          width="100%"
          height={60}
          sx={{
            mb: 2,
            borderRadius: 1,
            backgroundImage:
              'linear-gradient(90deg, rgba(135, 206, 235, 0.3) 0%, rgba(176, 224, 255, 0.2) 100%)',
            '&::after': {
              background:
                'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            },
          }}
        />

        {/* Summary Text Skeleton */}
        <Box>
          <Skeleton
            animation="wave"
            variant="text"
            width="100%"
            height={16}
            sx={{
              mb: 1,
              borderRadius: 1,
              backgroundImage:
                'linear-gradient(90deg, rgba(135, 206, 235, 0.3) 0%, rgba(176, 224, 255, 0.2) 100%)',
              '&::after': {
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              },
            }}
          />
          <Skeleton
            animation="wave"
            variant="text"
            width="100%"
            height={16}
            sx={{
              mb: 1,
              borderRadius: 1,
              backgroundImage:
                'linear-gradient(90deg, rgba(135, 206, 235, 0.3) 0%, rgba(176, 224, 255, 0.2) 100%)',
              '&::after': {
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              },
            }}
          />
          <Skeleton
            animation="wave"
            variant="text"
            width="100%"
            height={16}
            sx={{
              mb: 1,
              borderRadius: 1,
              backgroundImage:
                'linear-gradient(90deg, rgba(135, 206, 235, 0.3) 0%, rgba(176, 224, 255, 0.2) 100%)',
              '&::after': {
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              },
            }}
          />
          <Skeleton
            animation="wave"
            variant="text"
            width="100%"
            height={16}
            sx={{
              mb: 1,
              borderRadius: 1,
              backgroundImage:
                'linear-gradient(90deg, rgba(135, 206, 235, 0.3) 0%, rgba(176, 224, 255, 0.2) 100%)',
              '&::after': {
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              },
            }}
          />
          <Skeleton
            animation="wave"
            variant="text"
            width="80%"
            height={16}
            sx={{
              borderRadius: 1,
              backgroundImage:
                'linear-gradient(90deg, rgba(135, 206, 235, 0.3) 0%, rgba(176, 224, 255, 0.2) 100%)',
              '&::after': {
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              },
            }}
          />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Card
        sx={{
          background: 'linear-gradient(135deg, rgba(58, 75, 106, 0.8), rgba(74, 90, 120, 0.5))',
          color: '#fff',
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <ErrorMessage
          message={
            'Error fetching current weather data. Please check your internet connection or try again later.'
          }
        />
      </Card>
    );
  }

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, rgba(58, 75, 106, 0.8), rgba(74, 90, 120, 0.5))',
        color: '#fff',
        borderRadius: 2,
        p: { xs: 0.5, sm: 1 },
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        width: '100%',
      }}
    >
      <CardContent>
        {/* Header: Location & Refresh */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
          gap={1}
        >
          <Box>
            <Typography variant="subtitle2">
              Weather on {`${weather?.location.name}, ${weather?.location.country}.`}
            </Typography>
            <Typography variant="caption">{weather?.location.localtime}</Typography>
          </Box>
          <Tooltip title="Refresh">
            <Chip
              icon={
                <RefreshIcon
                  sx={{
                    animation: refreshingWeather ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
              }
              label={refreshingWeather ? 'Refreshing...' : 'Refresh'}
              size="small"
              sx={{
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontWeight: 500,
              }}
              clickable
              onClick={() => {
                setRefreshingWeather(true);
                getWeather(location);
              }}
            />
          </Tooltip>
        </Box>

        {/* Main Weather Info */}
        <Box display="flex" alignItems="center" flexDirection="row" mt={3} gap={2}>
          <img
            src={weather?.current.condition.icon}
            alt={weather?.current.condition.text}
            style={{
              width: '48px',
              height: '48px',
            }}
            srcSet={`
        ${weather?.current.condition.icon} 1x,
        ${weather?.current.condition.icon} 2x
          `}
            sizes="(max-width:600px) 40px, 56px"
            // Responsive size via sx for MUI v5+
            // If you want to use sx prop instead of style:
            // sx={{ width: { xs: 40, sm: 56 }, height: { xs: 40, sm: 56 } }}
          />
          <Box
            display="flex"
            alignItems="flex-end"
            sx={{
              mr: { xs: 0, sm: 1 },
              mb: { xs: 0.5, sm: 0 },
            }}
          >
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                mr: 0,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                lineHeight: 1,
              }}
            >
              {weather?.current.temp_c}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                lineHeight: 1.2,
              }}
            >
              °{temperatureUnit}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {weather?.current.condition.text}
            </Typography>
            <Typography variant="body2">
              Feels like{' '}
              <b>
                {weather?.current.feelslike_c}°{temperatureUnit}
              </b>
            </Typography>
          </Box>
        </Box>

        {/* Extra Metrics */}
        <Stack
          direction="row"
          spacing={2}
          mt={3}
          flexWrap="wrap"
          justifyContent={{ xs: 'center', sm: 'flex-start' }}
        >
          <Tooltip title="Air quality index (lower is better)">
            <Box display="flex" alignItems="center">
              <FiberMannualRecordIcon
                sx={{
                  mr: 0.5,
                  color:
                    airQuality <= 50
                      ? '#4caf50'
                      : airQuality <= 100
                        ? '#ffeb3b'
                        : airQuality <= 150
                          ? '#ff9800'
                          : airQuality <= 200
                            ? '#f44336'
                            : airQuality <= 300
                              ? '#8e24aa'
                              : '#795548',
                  fontSize: '1.2rem',
                }}
              />
              <Typography variant="body2">{airQuality}</Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Wind speed and direction">
            <Box display="flex" alignItems="center">
              <AirIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
              <Typography variant="body2">{weather?.current.wind_kph} kph</Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Humidity">
            <Box display="flex" alignItems="center">
              <OpacityIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
              <Typography variant="body2">{weather?.current.humidity}%</Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Visibility">
            <Box display="flex" alignItems="center">
              <VisibilityIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
              <Typography variant="body2">{weather?.current.vis_km} km</Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Pressure">
            <Box display="flex" alignItems="center">
              <CompressIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
              <Typography variant="body2">{weather?.current.pressure_mb} mb</Typography>
            </Box>
          </Tooltip>
          <Tooltip title="Dew point">
            <Box display="flex" alignItems="center">
              <DeviceThermostatIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
              <Typography variant="body2">
                {weather?.current.dewpoint_c}°{temperatureUnit}
              </Typography>
            </Box>
          </Tooltip>
        </Stack>

        {/* Weather Summary */}
        {loadingSummary ? (
          <Box>
            <Skeleton
              variant="text"
              width="100%"
              sx={{
                mt: 3,
                borderRadius: 1,
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                lineHeight: 1.5,
              }}
            />
            <Skeleton
              variant="text"
              width="100%"
              sx={{
                borderRadius: 1,
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                lineHeight: 1.5,
              }}
            />
            <Skeleton
              variant="text"
              width="100%"
              sx={{
                borderRadius: 1,
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                lineHeight: 1.5,
              }}
            />
          </Box>
        ) : (
          <>
            <Typography
              variant="body2"
              mt={3}
              sx={{
                textAlign: 'justify',
                fontSize: { xs: '0.85rem', sm: '0.9rem' },
                lineHeight: 1.5,
              }}
            >
              {currWeatherSummary}
            </Typography>
            <Typography
              variant="body2"
              mt={3}
              sx={{
                textAlign: 'justify',
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                lineHeight: 1.5,
                color: 'rgba(255, 255, 255, 0.7)',
                fontStyle: 'italic',
                marginTop: '1rem',
              }}
            >
              AI insights - AI can make mistakes.
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
