import { describe, it, expect, vi } from 'vitest';
import useChoices from './choicesStore';

describe('choicesStore', () => {
	describe('initial state', () => {
		it('should have empty choices', () => {
			const { choices } = useChoices.getState();
			expect(choices).toEqual([]);
		});
	});

	describe('setChoices', () => {
		it('should set choices from ink choices', () => {
			const inkChoices = [
				{ text: 'Choice 1', index: 0, tags: null },
				{ text: 'Choice 2', index: 1, tags: null },
			];
			useChoices.getState().setChoices(inkChoices as any);
			const { choices } = useChoices.getState();
			expect(choices.length).toBe(2);
			expect(choices[0].text).toBe('Choice 1');
			expect(choices[1].text).toBe('Choice 2');
		});

		it('should handle choices with tags', () => {
			const inkChoices = [
				{ text: 'Choice 1', index: 0, tags: ['unclickable'] },
			];
			useChoices.getState().setChoices(inkChoices as any);
			const { choices } = useChoices.getState();
			expect(choices[0].type).toBe('unclickable');
		});
	});
});