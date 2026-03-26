import { describe, it, expect, vi } from 'vitest';
import { Parser } from './Parser';

describe('Parser', () => {
	describe('tag', () => {
		it('should register tag handler', () => {
			const fn = vi.fn();
			Parser.tag('test', fn);
			expect(Parser.tags['test']).toBe(fn);
		});
	});

	describe('pattern', () => {
		it('should register pattern handler', () => {
			const fn = vi.fn();
			Parser.pattern('test', fn);
			expect(Parser.patterns).toHaveLength(1);
		});

		it('should register regex pattern', () => {
			const fn = vi.fn();
			Parser.pattern(/test/, fn);
			expect(Parser.patterns).toHaveLength(1);
		});
	});

	describe('process', () => {
		it('should return text unchanged if no handlers', () => {
			const result = Parser.process('Hello World');
			expect(result).toBe('Hello World');
		});

		it('should call tag handlers', () => {
			const fn = vi.fn();
			Parser.tag('test', fn);
			Parser.process('Hello', ['test']);
			expect(fn).toHaveBeenCalled();
		});

		it('should call pattern handlers', () => {
			const fn = vi.fn();
			Parser.pattern('Hello', fn);
			Parser.process('Hello World', []);
			expect(fn).toHaveBeenCalled();
		});

		it('should call regex pattern handlers', () => {
			const fn = vi.fn();
			Parser.pattern(/Hello/, fn);
			Parser.process('Hello World', []);
			expect(fn).toHaveBeenCalled();
		});

		it('should handle empty text', () => {
			const result = Parser.process('', []);
			expect(result).toBe('');
		});

		it('should handle undefined text', () => {
			const result = Parser.process(undefined as any, []);
			expect(result).toBe('');
		});
	});

	describe('clear', () => {
		it('should clear all handlers', () => {
			Parser.tag('test', vi.fn());
			Parser.pattern('test', vi.fn());
			Parser.clear();
			expect(Object.keys(Parser.tags).length).toBe(0);
			expect(Parser.patterns.length).toBe(0);
		});
	});
});