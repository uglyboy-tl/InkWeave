import { describe, it, expect, vi } from 'vitest';
import load from './scrollafterchoice';
import { Patches } from '../core/Patches';

describe('scrollafterchoice', () => {
	describe('load', () => {
		it('should register patch', () => {
			load();
			expect(Patches.patches.length).toBeGreaterThan(0);
		});
	});
});