import React from 'react';
import WeatherCard from './components/WeatherCard';
import WeatherWeek from './components/WeatherWeek';
import { Typography, CssBaseline, AppBar, Toolbar, Box, Container } from '@mui/material';
import WbSunnyRounded from '@mui/icons-material/WbSunnyRounded';
import WeatherInputCard from './components/WeatherInputCard';

const App: React.FC = () => {
  return (
    <div className="weather-container">
      <div className="background-effects">
        <div className="sun" />
        <div className="clouds">
          <div className="cloud cloud1" />
          <div className="cloud cloud2" />
          <div className="cloud cloud3" />
        </div>
        <div className="particles" id="particleContainer" />
      </div>

      <div className="app-content">
        <CssBaseline />
        <AppBar
          position="static"
          sx={{
            background:
              'linear-gradient(135deg, rgba(15, 76, 117, 0.9) 0%, rgba(50, 130, 184, 0.9) 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(176, 224, 255, 0.2)',
          }}
          elevation={0}
        >
          <Toolbar>
            <WbSunnyRounded fontSize="medium" sx={{ mr: 2, color: '#ffeb3b' }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }} noWrap>
              Weather Reporter
            </Typography>
          </Toolbar>
        </AppBar>

        <Container
          maxWidth="lg"
          sx={{
            py: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 'calc(100vh - 120px)',
          }}
        >
          <>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'stretch',
                gap: '2rem',
                justifyContent: 'space-between',
              }}
            >
              <WeatherCard />
              <WeatherInputCard />
            </Box>
            <WeatherWeek />
          </>
        </Container>
        <Box
          component="footer"
          sx={{
            width: '100%',
            py: 2,
            background:
              'linear-gradient(135deg, rgba(15, 76, 117, 0.8) 0%, rgba(50, 130, 184, 0.8) 100%)',
            textAlign: 'center',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(176, 224, 255, 0.2)',
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            © {new Date().getFullYear()} Weather Reporter. All rights reserved.
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default App;
