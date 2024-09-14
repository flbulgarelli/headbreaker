import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/headbreaker/index.ts'),
      name: 'Headbreaker',
      fileName: (format) => `headbreaker.${format}.js`,
    },
    rollupOptions: {
      //  konva
      external: ['konva', 'canvas'],
      output: {
        globals: {
          konva: 'Konva',
        },
      },
    },
  },
});
