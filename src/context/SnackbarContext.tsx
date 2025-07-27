// src/context/SnackbarContext.tsx
import { createContext } from 'react';
import type { AlertColor } from '@mui/material';

type SnackbarContextType = {
  showMessage: (message: string, severity?: AlertColor) => void;
};

export const SnackbarContext = createContext<SnackbarContextType>({
  showMessage: () => {},
});
