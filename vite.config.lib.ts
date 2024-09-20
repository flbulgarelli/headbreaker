import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  publicDir: 'false',
  build: {
    outDir: 'dist/lib',
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
