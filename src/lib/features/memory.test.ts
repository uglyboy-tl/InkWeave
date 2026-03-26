import { describe, it, expect, vi } from 'vitest';
import { default as memory, save, load, show, loadMemory } from './memory';
import { Patches } from '../core/Patches';
import useStorage from './storage';

describe('memory', () => {
	describe('show', () => {
		it('should return null for non-existent title', () => {
			const result = show('nonexistent');
			expect(result).toBeNull();
		});

		it('should return saves for existing title', () => {
			useStorage.getState().setStorage('test', 0, { state: 'test' });
			const result = show('test');
			expect(result).not.toBeNull();
			expect(result?.length).toBe(1);
		});
	});

	describe('save', () => {
		it('should save ink state', () => {
			const mockInk = {
				title: 'test',
				story: {
					state: {
						toJson: vi.fn().mockReturnValue('{"state":"test"}'),
					},
				},
				save_label: [],
			};
			save(0, mockInk as any);
			const result = show('test');
			expect(result).not.toBeNull();
		});

		it('should save additional labels', () => {
			const mockInk = {
				title: 'test',
				story: {
					state: {
						toJson: vi.fn().mockReturnValue('{}'),
					},
				},
				save_label: ['image'],
				image: 'test.png',
			};
			save(0, mockInk as any);
			const result = show('test');
			expect(result?.[0].data).toContain('test.png');
		});
	});

	describe('load', () => {
		it('should load ink state', () => {
			const mockInk = {
				title: 'test',
				story: {
					state: {
						toJson: vi.fn().mockReturnValue('{}'),
						LoadJson: vi.fn(),
					},
					Continue: vi.fn(),
					currentTags: [],
					currentChoices: [],
					variablesState: {},
				},
				clear: vi.fn(),
				continue: vi.fn(),
				save_label: [],
			};
			const saveData = '{"state":"{}"}';
			load(saveData, mockInk as any);
			expect(mockInk.story.state.LoadJson).toHaveBeenCalled();
		});

		it('should load additional labels', () => {
			const mockInk = {
				title: 'test',
				story: {
					state: {
						toJson: vi.fn().mockReturnValue('{}'),
						LoadJson: vi.fn(),
					},
					Continue: vi.fn(),
					currentTags: [],
					currentChoices: [],
					variablesState: {},
				},
				clear: vi.fn(),
				continue: vi.fn(),
				save_label: ['image'],
				image: '',
			};
			const saveData = JSON.stringify({ state: '{}', image: 'test.png' });
			load(saveData, mockInk as any);
			expect(mockInk.image).toBe('test.png');
		});
	});

	describe('loadMemory', () => {
		it('should register patch', () => {
			loadMemory();
			expect(Patches.patches.length).toBeGreaterThan(0);
		});
	});

	describe('default export', () => {
		it('should export save, load, show', () => {
			expect(memory.save).toBe(save);
			expect(memory.load).toBe(load);
			expect(memory.show).toBe(show);
		});
	});
});