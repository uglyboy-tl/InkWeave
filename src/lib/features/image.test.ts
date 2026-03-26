import { describe, it, expect, vi } from 'vitest';
import load, { useStoryImage } from './image';
import { Tags } from '../core/Tags';
import { Patches } from '../core/Patches';

describe('image', () => {
	describe('load', () => {
		it('should register image tag', () => {
			load();
			expect(Tags.functions.has('image')).toBe(true);
		});

		it('should register patch', () => {
			load();
			expect(Patches.patches.length).toBeGreaterThan(0);
		});
	});

	describe('useStoryImage', () => {
		it('should have initial empty image', () => {
			expect(useStoryImage.getState().image).toBe('');
		});

		it('should set image', () => {
			useStoryImage.getState().setImage('test.png');
			expect(useStoryImage.getState().image).toBe('test.png');
		});

		it('should clear image', () => {
			useStoryImage.getState().setImage('test.png');
			useStoryImage.getState().setImage('');
			expect(useStoryImage.getState().image).toBe('');
		});
	});

	describe('fileHandler integration', () => {
		it('should use fileHandler for path resolution', () => {
			load();
			const mockFileHandler = {
				ResolveInkFilename: vi.fn((path: string) => `/base/${path}`),
				LoadInkFileContents: vi.fn(),
			};
			const mockStory = {
				options: { fileHandler: mockFileHandler },
				save_label: [],
				clears: [],
			};
			Tags.process(mockStory as any, 'image: test.png');
			expect(useStoryImage.getState().image).toBe('/base/test.png');
		});

		it('should handle path without fileHandler', () => {
			load();
			const mockStory = {
				options: {},
				save_label: [],
				clears: [],
			};
			Tags.process(mockStory as any, 'image: test.png');
			expect(useStoryImage.getState().image).toBe('test.png');
		});
	});
});