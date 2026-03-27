import { describe, it, expect, beforeEach } from 'vitest';
import contentsStore from '../contents';
import { CHOICE_SEPARATOR } from '../../types';

describe('contentsStore', () => {
	beforeEach(() => {
		contentsStore.getState().setContents([]);
		contentsStore.setState({ refreshKey: 0 });
	});

	describe('initial state', () => {
		it('should have empty contents', () => {
			const { contents } = contentsStore.getState();
			expect(contents).toEqual([]);
		});

		it('should have refreshKey of 0', () => {
			const { refreshKey } = contentsStore.getState();
			expect(refreshKey).toBe(0);
		});
	});

	describe('setContents', () => {
		it('should set contents', () => {
			contentsStore.getState().setContents(['hello', 'world']);
			const { contents } = contentsStore.getState();
			expect(contents).toEqual(['hello', 'world']);
		});
	});

	describe('add', () => {
		it('should add content', () => {
			contentsStore.getState().setContents([]);
			contentsStore.getState().add(['hello']);
			contentsStore.getState().add(['world']);
			const { contents } = contentsStore.getState();
			expect(contents).toEqual(['hello', 'world']);
		});
	});

	describe('refresh', () => {
		it('should increment refreshKey', () => {
			const { refreshKey: initialKey } = contentsStore.getState();
			contentsStore.getState().refresh();
			const { refreshKey } = contentsStore.getState();
			expect(refreshKey).toBe(initialKey + 1);
		});

		it('should increment refreshKey multiple times', () => {
			contentsStore.getState().refresh();
			const { refreshKey: key1 } = contentsStore.getState();
			contentsStore.getState().refresh();
			const { refreshKey: key2 } = contentsStore.getState();
			contentsStore.getState().refresh();
			const { refreshKey: key3 } = contentsStore.getState();
			expect(key2).toBe(key1 + 1);
			expect(key3).toBe(key2 + 1);
		});
	});

	describe('CHOICE_SEPARATOR', () => {
		it('should be defined', () => {
			expect(CHOICE_SEPARATOR).toBeDefined();
			expect(typeof CHOICE_SEPARATOR).toBe('string');
		});
	});
});