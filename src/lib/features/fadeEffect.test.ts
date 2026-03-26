import { describe, it, expect, vi } from 'vitest';
import load from './fadeEffect';
import { Patches } from '../core/Patches';

describe('fadeEffect', () => {
	describe('load', () => {
		it('should register patch', () => {
			load();
			expect(Patches.patches.length).toBeGreaterThan(0);
		});

		it('should not throw', () => {
			expect(() => load()).not.toThrow();
		});
	});
});