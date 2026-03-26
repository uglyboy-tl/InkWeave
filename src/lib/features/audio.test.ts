import { describe, it, expect, vi } from 'vitest';
import load, { AudioController } from './audio';
import { Tags } from '../core/Tags';
import { Patches } from '../core/Patches';

describe('audio', () => {
	describe('load', () => {
		it('should register sound tag', () => {
			load();
			expect(Tags.functions.has('sound')).toBe(true);
		});

		it('should register music tag', () => {
			load();
			expect(Tags.functions.has('music')).toBe(true);
		});

		it('should register patch', () => {
			load();
			expect(Patches.patches.length).toBeGreaterThan(0);
		});
	});

	describe('AudioController', () => {
		it('should have null sound initially', () => {
			expect(AudioController.sound).toBeNull();
		});

		it('should have null music initially', () => {
			expect(AudioController.music).toBeNull();
		});

		it('should cleanup sound without error', () => {
			expect(() => AudioController.cleanupSound()).not.toThrow();
		});

		it('should cleanup music without error', () => {
			expect(() => AudioController.cleanupMusic()).not.toThrow();
		});

		it('should process sound tag with null', () => {
			load();
			const mockStory = { options: {}, cleanups: [] };
			Tags.process(mockStory as any, 'sound');
		});

		it('should process music tag with null', () => {
			load();
			const mockStory = { options: {}, cleanups: [] };
			Tags.process(mockStory as any, 'music');
		});
	});

	describe('fileHandler integration', () => {
		it('should use fileHandler for sound path resolution', () => {
			load();
			const mockFileHandler = {
				ResolveInkFilename: vi.fn((path: string) => `/base/${path}`),
				LoadInkFileContents: vi.fn(),
			};
			const mockStory = {
				options: { fileHandler: mockFileHandler },
				cleanups: [],
			};
			Tags.process(mockStory as any, 'sound: click.mp3');
			expect(mockFileHandler.ResolveInkFilename).toHaveBeenCalledWith('click.mp3');
		});

		it('should use fileHandler for music path resolution', () => {
			load();
			const mockFileHandler = {
				ResolveInkFilename: vi.fn((path: string) => `/base/${path}`),
				LoadInkFileContents: vi.fn(),
			};
			const mockStory = {
				options: { fileHandler: mockFileHandler },
				cleanups: [],
			};
			Tags.process(mockStory as any, 'music: bgm.mp3');
			expect(mockFileHandler.ResolveInkFilename).toHaveBeenCalledWith('bgm.mp3');
		});

		it('should handle path without fileHandler', () => {
			load();
			const mockStory = {
				options: {},
				cleanups: [],
			};
			Tags.process(mockStory as any, 'sound: click.mp3');
		});
	});
});