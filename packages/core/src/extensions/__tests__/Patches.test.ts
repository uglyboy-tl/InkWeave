import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Patches } from '../Patches';

describe('Patches', () => {
	beforeEach(() => {
		Patches.clear();
	});

	describe('add', () => {
		it('should add patch function', () => {
			const mockFn = vi.fn();
			Patches.add(mockFn, {});
			expect(Patches.patches).toHaveLength(1);
		});

		it('should store options', () => {
			Patches.add(null, { test: true });
			expect(Patches.patches).toHaveLength(0);
		});
	});

	describe('apply', () => {
		it('should apply patches to story', () => {
			const mockFn = vi.fn();
			Patches.add(mockFn, { key: 'value' });
			const story = { options: {} };
			Patches.apply(story, '');
			expect(mockFn).toHaveBeenCalled();
			expect(story.options).toEqual({ key: 'value' });
		});
	});

	describe('clear', () => {
		it('should clear all patches', () => {
			Patches.add(() => {}, {});
			Patches.clear();
			expect(Patches.patches).toHaveLength(0);
		});
	});
});