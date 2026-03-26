import { describe, it, expect, vi, beforeEach } from 'vitest';
import load from './linkopen';
import { Tags } from '../core/Tags';

describe('linkopen', () => {
	beforeEach(() => {
		Tags.clear();
	});

	describe('load', () => {
		it('should register linkopen tag', () => {
			load();
			expect(Tags.functions.has('linkopen')).toBe(true);
		});

		it('should handle null value', () => {
			load();
			const mockStory = { options: {} };
			Tags.process(mockStory as any, 'linkopen');
		});

		it('should handle empty value', () => {
			load();
			const mockStory = { options: {} };
			Tags.process(mockStory as any, 'linkopen: ');
		});
	});

	describe('URL security', () => {
		it('should open http URLs', () => {
			const originalOpen = window.open;
			let called = false;
			let calledWith: string | undefined;
			window.open = (url?: string | URL) => {
				called = true;
				calledWith = url?.toString();
				return null;
			};
			load();
			const mockStory = { options: {} };
			Tags.process(mockStory as any, 'linkopen: http://example.com');
			window.open = originalOpen;
			expect(called).toBe(true);
			expect(calledWith).toBe('http://example.com');
		});

		it('should open https URLs', () => {
			const originalOpen = window.open;
			let called = false;
			let calledWith: string | undefined;
			window.open = (url?: string | URL) => {
				called = true;
				calledWith = url?.toString();
				return null;
			};
			load();
			const mockStory = { options: {} };
			Tags.process(mockStory as any, 'linkopen: https://example.com');
			window.open = originalOpen;
			expect(called).toBe(true);
			expect(calledWith).toBe('https://example.com');
		});

		it('should block javascript: protocol', () => {
			const originalOpen = window.open;
			let called = false;
			window.open = () => {
				called = true;
				return null;
			};
			load();
			const mockStory = { options: {} };
			Tags.process(mockStory as any, 'linkopen: javascript:alert(1)');
			window.open = originalOpen;
			expect(called).toBe(false);
		});

		it('should block data: protocol', () => {
			const originalOpen = window.open;
			let called = false;
			window.open = () => {
				called = true;
				return null;
			};
			load();
			const mockStory = { options: {} };
			Tags.process(mockStory as any, 'linkopen: data:text/html,<script>alert(1)</script>');
			window.open = originalOpen;
			expect(called).toBe(false);
		});

		it('should block invalid URLs', () => {
			const originalOpen = window.open;
			let called = false;
			window.open = () => {
				called = true;
				return null;
			};
			load();
			const mockStory = { options: {} };
			Tags.process(mockStory as any, 'linkopen: not-a-valid-url');
			window.open = originalOpen;
			expect(called).toBe(false);
		});
	});
});