import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        minify: 'esbuild',
        cssMinify: true, // Explicitly enforce CSS minification per Rule #5
        rollupOptions: {
            output: {
                manualChunks: undefined, // Let Vite optimize chunks
            },
        },
    },
});
