// Core exports
export * from './core';

// Stores exports
export * from './stores';

// Features exports
export * from './features';

// Components exports
export * from './components';

// Types
export interface InkPlayerOptions {
	container?: string | HTMLElement;
	story: string;
	title?: string;
	theme?: 'light' | 'dark';
	saveSlots?: number;
	lineDelay?: number;
	fadeInDuration?: number;
	basePath?: string;
}