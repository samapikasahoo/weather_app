import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Tooltip } from '@mui/material';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FlagIcon from '@mui/icons-material/Flag';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import CompressIcon from '@mui/icons-material/Compress';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import GrainIcon from '@mui/icons-material/Grain';

export interface WeatherHourProps {
  hour: string;
  icon: string;
  temp_c: number;
  condition: string;
  feelslike_c: number;
  wind_mph: number;
  cloud: number;
  visibility: string;
  gust_mph: number;
  humidity: number;
  dewpoint_c: number;
  pressure_in: number;
  uv: number;
}

const WeatherHour: React.FC<WeatherHourProps> = ({
  hour,
  icon,
  temp_c,
  condition,
  feelslike_c,
  wind_mph,
  cloud,
  visibility,
  gust_mph,
  humidity,
  dewpoint_c,
  pressure_in,
  uv,
}) => (
  <Card
    sx={{
      background: 'linear-gradient(135deg, #22304a 0%, #2d3956 100%)',
      color: '#fff',
      borderRadius: 3,
      minWidth: 200,
      boxShadow: 2,
      m: 1,
    }}
  >
    <CardContent sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="inherit" gutterBottom>
        {hour}
      </Typography>
      <Box display="flex" alignItems="center" mb={1}>
        <img
          src={icon.replace('//', 'https://')}
          alt={condition}
          width={32}
          style={{ marginRight: 8 }}
        />
        <Typography variant="h5" fontWeight={700} ml={1}>
          {Math.round(temp_c)}°C
        </Typography>
      </Box>
      <Box
        sx={{
          minHeight: 56, // Reserve space for up to 3 lines (3 * 18px + padding)
          display: 'flex',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography
          variant="body2"
          color="inherit"
          sx={{
            width: '100%',
            textAlign: 'center',
            wordBreak: 'break-word',
            whiteSpace: 'pre-line',
          }}
        >
          {condition}
        </Typography>
      </Box>
      <Stack spacing={0.5} mt={1}>
        <Tooltip title="Feels like">
          <Box display="flex" alignItems="center">
            <DeviceThermostatIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption">{Math.round(feelslike_c)}°C</Typography>
          </Box>
        </Tooltip>
        <Tooltip title="Wind">
          <Box display="flex" alignItems="center">
            <AirIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption">{wind_mph} mph</Typography>
          </Box>
        </Tooltip>
        <Tooltip title="Cloud cover">
          <Box display="flex" alignItems="center">
            <GrainIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption">{cloud}%</Typography>
          </Box>
        </Tooltip>
        <Tooltip title="Visibility">
          <Box display="flex" alignItems="center">
            <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption">{visibility}</Typography>
          </Box>
        </Tooltip>
        <Tooltip title="Wind gust">
          <Box display="flex" alignItems="center">
            <FlagIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption">{gust_mph} mph</Typography>
          </Box>
        </Tooltip>
        <Tooltip title="Humidity">
          <Box display="flex" alignItems="center">
            <OpacityIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption">{humidity}%</Typography>
          </Box>
        </Tooltip>
        <Tooltip title="Dew point">
          <Box display="flex" alignItems="center">
            <DeviceThermostatIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption">{Math.round(dewpoint_c)}°C</Typography>
          </Box>
        </Tooltip>
        <Tooltip title="Pressure">
          <Box display="flex" alignItems="center">
            <CompressIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption">{pressure_in} in</Typography>
          </Box>
        </Tooltip>
        <Tooltip title="UV index">
          <Box display="flex" alignItems="center">
            <WbSunnyIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption">{Math.round(uv)}</Typography>
          </Box>
        </Tooltip>
      </Stack>
    </CardContent>
  </Card>
);

export default WeatherHour;
