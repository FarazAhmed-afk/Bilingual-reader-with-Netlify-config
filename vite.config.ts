import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  // Unit tests run in node; files named *.dom.test.tsx run in jsdom (see the pragma in each file).
  test: { environment: 'node', setupFiles: ['./src/test/setup.ts'] },
});
