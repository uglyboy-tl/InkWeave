import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InkStory } from './InkStory';

describe('InkStory', () => {
	let mockStory: any;
	let ink: InkStory;

	beforeEach(() => {
		mockStory = {
			state: {
				toJson: vi.fn().mockReturnValue('{}'),
				LoadJson: vi.fn(),
			},
			canContinue: true,
			Continue: vi.fn().mockReturnValue('Hello'),
			currentTags: [],
			currentChoices: [],
			variablesState: {},
			ChooseChoiceIndex: vi.fn(),
			ResetState: vi.fn(),
			ToJson: vi.fn().mockReturnValue('{}'),
		};
		ink = new InkStory(mockStory, 'Test');
	});

	describe('constructor', () => {
		it('should initialize with title', () => {
			expect(ink.title).toBe('Test');
		});

		it('should have default options', () => {
			expect(ink.options.linedelay).toBe(0.05);
		});

		it('should set story property', () => {
			expect(ink.story).toBe(mockStory);
		});
	});

	describe('contents', () => {
		it('should get contents', () => {
			expect(ink.contents).toEqual([]);
		});
	});

	describe('choices', () => {
		it('should get choices', () => {
			expect(ink.choices).toEqual([]);
		});
	});

	describe('save_label', () => {
		it('should have contents label', () => {
			expect(ink.save_label).toContain('contents');
		});
	});

	describe('effects', () => {
		it('should get side effects', () => {
			expect(ink.effects).toEqual([]);
		});
	});

	describe('clears', () => {
		it('should get clear functions', () => {
			expect(ink.clears.length).toBeGreaterThan(0);
		});
	});

	describe('cleanups', () => {
		it('should get cleanup functions', () => {
			expect(ink.cleanups).toEqual([]);
		});
	});

	describe('dispose', () => {
		it('should call cleanup functions', () => {
			const fn = vi.fn();
			ink._cleanups.push(fn);
			ink.dispose();
			expect(fn).toHaveBeenCalled();
		});

		it('should handle multiple cleanups', () => {
			const fn1 = vi.fn();
			const fn2 = vi.fn();
			ink._cleanups.push(fn1, fn2);
			ink.dispose();
			expect(fn1).toHaveBeenCalled();
			expect(fn2).toHaveBeenCalled();
		});
	});

	describe('useEffect', () => {
		it('should call effect functions', () => {
			const fn = vi.fn();
			ink._side_effects.push(fn);
			ink.useEffect();
			expect(fn).toHaveBeenCalled();
		});
	});
});