import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { LocationProvider } from './context/LocationProvider';
import { SnackbarProvider } from './context/SnackbarProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnackbarProvider>
      <LocationProvider>
        <App />
      </LocationProvider>
    </SnackbarProvider>
  </StrictMode>,
);
