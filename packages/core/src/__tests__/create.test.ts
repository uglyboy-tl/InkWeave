import { describe, it, expect, vi } from 'bun:test';
import { Story } from 'inkjs/engine/Story';
import { createInkStory } from '../create';
import { BaseFileHandler } from '../types';
import type { FileHandler } from '../types';

describe('createInkStory', () => {
  describe('input type detection', () => {
    it('should accept Story object directly', () => {
      const jsonContent = JSON.stringify({
        inkVersion: 21,
        root: [],
        listDefs: {},
      });
      const story = new Story(jsonContent);

      const ink = createInkStory(story, { title: 'Test' });
      expect(ink.title).toBe('Test');
    });

    it('should parse compiled JSON string', () => {
      const jsonContent = JSON.stringify({
        inkVersion: 21,
        root: [],
        listDefs: {},
      });

      const ink = createInkStory(jsonContent, { title: 'JSON Test' });
      expect(ink.title).toBe('JSON Test');
    });

    it('should compile ink source code', () => {
      const source = 'Hello World\n+ [Choice]';
      const ink = createInkStory(source, { title: 'Source Test' });
      expect(ink.title).toBe('Source Test');
    });

    it('should throw error for invalid input type', () => {
      expect(() => createInkStory(123 as unknown as string)).toThrow();
    });
  });

  describe('with FileHandler', () => {
    it('should use custom FileHandler for INCLUDE', () => {
      const source = 'INCLUDE test.ink\nHello World';
      const handler: FileHandler = {
        loadFile: vi.fn().mockReturnValue('Included content'),
      };

      const ink = createInkStory(source, {
        title: 'Include Test',
        fileHandler: handler,
      });
      expect(ink.title).toBe('Include Test');
    });

    it('should use BaseFileHandler.resolveFilename', () => {
      const source = 'INCLUDE test.ink\nHello World';

      class TestHandler extends BaseFileHandler {
        loadFile(filename: string): string {
          return `Content of ${filename}`;
        }
      }

      const handler = new TestHandler({ basePath: './stories' });
      const resolveSpy = vi.spyOn(handler, 'resolveFilename');

      createInkStory(source, { fileHandler: handler });

      expect(resolveSpy).toHaveBeenCalled();
    });
  });

  describe('options', () => {
    it('should apply title option', () => {
      const source = 'Hello';
      const ink = createInkStory(source, { title: 'Custom Title' });
      expect(ink.title).toBe('Custom Title');
    });

    it('should use default title if not provided', () => {
      const source = 'Hello';
      const ink = createInkStory(source);
      expect(ink.title).toBe('Ink Story');
    });

    it('should apply linedelay option', () => {
      const source = 'Hello';
      const ink = createInkStory(source, { linedelay: 0.1 });
      expect(ink.options.linedelay).toBe(0.1);
    });
  });
});
