import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import WeatherHour from './WeatherHourCard';
import type { ForecastDay } from '../utils/types';

const WeatherDay: React.FC<ForecastDay> = memo(({ date, hour }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          ml: 2,
          color: 'rgba(255, 255, 255, 0.95)',
          fontWeight: 600,
          textShadow: '2px 2px 4px rgba(15, 76, 117, 0.4)',
        }}
      >
        {formatDate(date)}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          overflowX: 'auto',
          overflowY: 'hidden',
          gap: 1,
          pb: 1,
          '&::-webkit-scrollbar': {
            height: 3,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(176, 224, 255, 0.3)',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'rgba(176, 224, 255, 0.5)',
            },
          },
        }}
      >
        {hour.map((hour, index) => (
          <WeatherHour
            key={`${hour.time_epoch}-${index}`}
            hour={new Date(hour.time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
            icon={hour.condition.icon}
            temp_c={hour.temp_c}
            condition={hour.condition.text}
            feelslike_c={hour.feelslike_c}
            wind_mph={hour.wind_mph}
            cloud={hour.cloud}
            visibility={`${hour.vis_miles} mi`}
            gust_mph={hour.gust_mph}
            humidity={hour.humidity}
            dewpoint_c={hour.dewpoint_c}
            pressure_in={hour.pressure_in}
            uv={hour.uv}
          />
        ))}
      </Box>
    </Box>
  );
});

WeatherDay.displayName = 'WeatherDay';

export default WeatherDay;
