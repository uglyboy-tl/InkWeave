import { describe, it, expect } from 'vitest';
import { BaseFileHandler, type FileHandler } from '../types';

describe('BaseFileHandler', () => {
	describe('constructor', () => {
		it('should create handler with default basePath', () => {
			const handler = new BaseFileHandler();
			expect(handler).toBeDefined();
		});

		it('should accept basePath option', () => {
			const handler = new BaseFileHandler({ basePath: './stories' });
			expect(handler).toBeDefined();
		});
	});

	describe('resolveFilename', () => {
		it('should return filename as-is when no basePath', () => {
			const handler = new BaseFileHandler();
			expect(handler.resolveFilename('test.ink')).toBe('test.ink');
		});

		it('should prepend basePath when set', () => {
			const handler = new BaseFileHandler({ basePath: './stories' });
			expect(handler.resolveFilename('test.ink')).toBe('./stories/test.ink');
		});

		it('should handle trailing slash in basePath', () => {
			const handler = new BaseFileHandler({ basePath: './stories/' });
			expect(handler.resolveFilename('test.ink')).toBe('./stories//test.ink');
		});

		it('should handle empty basePath', () => {
			const handler = new BaseFileHandler({ basePath: '' });
			expect(handler.resolveFilename('test.ink')).toBe('test.ink');
		});
	});

	describe('loadFile', () => {
		it('should throw error by default', () => {
			const handler = new BaseFileHandler();
			expect(() => handler.loadFile('test.ink')).toThrow('loadFile must be implemented by subclass');
		});
	});
});

describe('FileHandler interface', () => {
	it('should work with custom implementation', () => {
		class CustomHandler implements FileHandler {
			loadFile(filename: string): string {
				return `Content of ${filename}`;
			}
		}

		const handler = new CustomHandler();
		expect(handler.loadFile('test.ink')).toBe('Content of test.ink');
	});
});