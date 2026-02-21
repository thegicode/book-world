import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // DOM 환경 사용
    alias: {
      '@': path.resolve(__dirname, './app/src/scripts'),
    },
  },
});
