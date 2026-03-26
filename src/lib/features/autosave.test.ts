import { describe, it, expect, vi } from 'vitest';
import load from './autosave';
import { Tags } from '../core/Tags';

describe('autosave', () => {
	describe('load', () => {
		it('should register autosave tag', () => {
			load();
			expect(Tags.functions.has('autosave')).toBe(true);
		});

		it('should not throw when called', () => {
			expect(() => load()).not.toThrow();
		});
	});
});