// vite.config.ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: ['node_modules/**', '@mui'], // Exclude MUI modules to avoid too many file opens
    include: ['src/**/*.{test,spec}.{ts,tsx}'], // Include test files
  },
});
