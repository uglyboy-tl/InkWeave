import { describe, it, expect, vi } from 'vitest';
import { Tags, splitAtCharacter } from './Tags';

describe('Tags', () => {
	describe('splitAtCharacter', () => {
		it('should split at colon', () => {
			const result = splitAtCharacter('image: path.png', ':');
			expect(result).toEqual({
				before: 'image',
				after: 'path.png',
			});
		});

		it('should return trimmed values', () => {
			const result = splitAtCharacter('  image  :  path.png  ', ':');
			expect(result).toEqual({
				before: 'image',
				after: 'path.png',
			});
		});

		it('should return undefined for empty string', () => {
			const result = splitAtCharacter('', ':');
			expect(result).toBeUndefined();
		});

		it('should return only before if no separator', () => {
			const result = splitAtCharacter('image', ':');
			expect(result).toEqual({ before: 'image' });
		});

		it('should return undefined for null', () => {
			const result = splitAtCharacter(null as any, ':');
			expect(result).toBeUndefined();
		});
	});

	describe('add', () => {
		it('should register and process custom tag', () => {
			const mockFn = vi.fn();
			Tags.add('test', mockFn);
			Tags.process({} as any, 'test: value');
			expect(mockFn).toHaveBeenCalledWith('value', expect.anything());
		});

		it('should register tag without after value', () => {
			const mockFn = vi.fn();
			Tags.add('test', mockFn);
			Tags.process({} as any, 'test');
			expect(mockFn).toHaveBeenCalledWith(undefined, expect.anything());
		});
	});

	describe('process', () => {
		it('should update options with number value', () => {
			const story = { options: { linedelay: 0 } } as any;
			Tags.process(story, 'linedelay: 0.1');
			expect(story.options.linedelay).toBe(0.1);
		});

		it('should update options with boolean value', () => {
			const story = { options: { debug: false } } as any;
			Tags.process(story, 'debug: true');
			expect(story.options.debug).toBe(true);
		});

		it('should handle unknown tag', () => {
			const story = { options: {} } as any;
			Tags.process(story, 'unknown: value');
		});
	});

	describe('clear', () => {
		it('should clear custom tags', () => {
			Tags.add('custom', vi.fn());
			Tags.clear();
			expect(Tags.functions.has('custom')).toBe(false);
		});

		it('should keep default tags', () => {
			Tags.clear();
			expect(Tags.functions.has('clear')).toBe(true);
			expect(Tags.functions.has('restart')).toBe(true);
		});
	});
});