import { describe, it, expect, vi } from 'vitest';
import useVariables from './variablesStore';

describe('variablesStore', () => {
	describe('initial state', () => {
		it('should have empty variables map', () => {
			const { variables } = useVariables.getState();
			expect(variables).toBeInstanceOf(Map);
			expect(variables.size).toBe(0);
		});
	});

	describe('setGlobalVars', () => {
		it('should set global variables', () => {
			const mockVariablesState = {
				_globalVariables: new Map([
					['var1', { value: 'value1' }],
					['var2', { value: 42 }],
				]),
			};
			useVariables.getState().setGlobalVars(mockVariablesState as any);
			const { variables } = useVariables.getState();
			expect(variables.get('var1')).toBe('value1');
			expect(variables.get('var2')).toBe(42);
		});
	});
});