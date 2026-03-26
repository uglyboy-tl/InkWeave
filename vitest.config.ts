import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./test/setup.ts'],
		include: ['src/lib/**/*.test.ts'],
		coverage: {
			provider: 'istanbul',
			include: ['src/lib/**/*.ts'],
			exclude: ['src/lib/**/*.test.ts', 'src/lib/**/index.ts'],
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@lib': resolve(__dirname, 'src/lib'),
		},
	},
});