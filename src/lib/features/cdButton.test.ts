import { describe, it, expect, vi } from 'vitest';
import load from './cdButton';
import { ChoiceParser } from '../core/ChoiceParser';

describe('cdButton', () => {
	describe('load', () => {
		it('should register cd tag', () => {
			load();
			expect(ChoiceParser.tags.has('cd')).toBe(true);
		});

		it('should register component', () => {
			load();
			expect(ChoiceParser.components.has('cd')).toBe(true);
		});

		it('should not throw', () => {
			expect(() => load()).not.toThrow();
		});
	});

	describe('choice processing', () => {
		it('should set cd type on choice', () => {
			load();
			const choice: any = { text: 'Test', index: 0, type: 'default' };
			ChoiceParser.tags.get('cd')?.(choice, '5');
			expect(choice.type).toBe('cd');
			expect(choice.val).toBe('5');
		});
	});
});