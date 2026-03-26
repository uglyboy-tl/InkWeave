import { describe, it, expect, vi } from 'vitest';
import load from './autoButton';
import { ChoiceParser } from '../core/ChoiceParser';

describe('autoButton', () => {
	describe('load', () => {
		it('should register auto tag', () => {
			load();
			expect(ChoiceParser.tags.has('auto')).toBe(true);
		});

		it('should register component', () => {
			load();
			expect(ChoiceParser.components.has('auto')).toBe(true);
		});
	});

	describe('choice processing', () => {
		it('should set auto type on choice', () => {
			load();
			const choice: any = { text: 'Test', index: 0, type: 'default' };
			ChoiceParser.tags.get('auto')?.(choice, '5');
			expect(choice.type).toBe('auto');
			expect(choice.val).toBe('5');
		});
	});
});