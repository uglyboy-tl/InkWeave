import { describe, it, expect, vi } from 'vitest';
import useStory from './storyStore';

describe('storyStore', () => {
	describe('initial state', () => {
		it('should have null ink', () => {
			const { ink } = useStory.getState();
			expect(ink).toBeNull();
		});
	});

	describe('setStory', () => {
		it('should set story', () => {
			const mockStory = {
				state: { toJson: vi.fn(), LoadJson: vi.fn() },
				Continue: vi.fn(),
				currentTags: [],
				ToJson: vi.fn().mockReturnValue('{}'),
			};
			useStory.getState().setStory(mockStory as any, 'Test');
			const { ink } = useStory.getState();
			expect(ink).not.toBeNull();
			expect(ink?.title).toBe('Test');
		});
	});
});