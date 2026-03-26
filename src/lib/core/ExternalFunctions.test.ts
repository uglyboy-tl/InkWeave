import { describe, it, expect, vi } from 'vitest';
import { ExternalFunctions } from './ExternalFunctions';

describe('ExternalFunctions', () => {
	describe('add', () => {
		it('should register function', () => {
			const fn = () => 'result';
			ExternalFunctions.add('test', fn);
			expect(ExternalFunctions.get('test')).toBe(fn);
		});

		it('should register multiple functions', () => {
			const fn1 = () => 1;
			const fn2 = () => 2;
			ExternalFunctions.add('fn1', fn1);
			ExternalFunctions.add('fn2', fn2);
			expect(ExternalFunctions.functions.size).toBe(2);
		});
	});

	describe('get', () => {
		it('should return registered function', () => {
			const fn = () => 'result';
			ExternalFunctions.add('test', fn);
			expect(ExternalFunctions.get('test')).toBe(fn);
		});

		it('should return undefined for non-existent', () => {
			expect(ExternalFunctions.get('nonexistent')).toBeUndefined();
		});
	});

	describe('bind', () => {
		it('should bind function to story', () => {
			const fn = vi.fn();
			ExternalFunctions.add('test', fn);
			const ink = {
				story: {
					BindExternalFunction: vi.fn(),
				},
			};
			ExternalFunctions.bind(ink as any, 'test');
			expect(ink.story.BindExternalFunction).toHaveBeenCalled();
		});

		it('should handle undefined function', () => {
			const ink = {
				story: {
					BindExternalFunction: vi.fn(),
				},
			};
			ExternalFunctions.bind(ink as any, 'nonexistent');
			expect(ink.story.BindExternalFunction).not.toHaveBeenCalled();
		});
	});

	describe('clear', () => {
		it('should clear all functions', () => {
			ExternalFunctions.add('fn1', () => {});
			ExternalFunctions.add('fn2', () => {});
			ExternalFunctions.clear();
			expect(ExternalFunctions.functions.size).toBe(0);
		});
	});

	describe('functions getter', () => {
		it('should return functions map', () => {
			const fn = () => {};
			ExternalFunctions.add('test', fn);
			expect(ExternalFunctions.functions.has('test')).toBe(true);
		});
	});
});