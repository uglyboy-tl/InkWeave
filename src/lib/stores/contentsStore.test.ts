import { describe, it, expect, vi } from 'vitest';
import useContents, { CHOICE_SEPARATOR } from './contentsStore';

describe('contentsStore', () => {
	describe('initial state', () => {
		it('should have empty contents', () => {
			const { contents } = useContents.getState();
			expect(contents).toEqual([]);
		});
	});

	describe('setContents', () => {
		it('should set contents', () => {
			useContents.getState().setContents(['hello', 'world']);
			const { contents } = useContents.getState();
			expect(contents).toEqual(['hello', 'world']);
		});
	});

	describe('add', () => {
		it('should add content', () => {
			useContents.getState().add(['hello']);
			useContents.getState().add(['world']);
			const { contents } = useContents.getState();
			expect(contents).toEqual(['hello', 'world']);
		});
	});

	describe('CHOICE_SEPARATOR', () => {
		it('should be defined', () => {
			expect(CHOICE_SEPARATOR).toBeDefined();
			expect(typeof CHOICE_SEPARATOR).toBe('string');
		});
	});
});