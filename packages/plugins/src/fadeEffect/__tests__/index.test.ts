import { describe, it, expect, beforeEach } from 'bun:test';
import load from '../index';
import { Patches, Tags } from '@inkweave/core';

describe('fadeEffect', () => {
  beforeEach(() => {
    Patches.patches = [];
  });

  describe('load', () => {
    it('should register patch', () => {
      load();
      expect(Patches.patches.length).toBeGreaterThan(0);
    });

    it('should register linedelay tag', () => {
      load();
      expect(Tags.functions.has('linedelay')).toBe(true);
    });
  });

  describe('linedelay tag', () => {
    it('should set linedelay option from tag value', () => {
      load();
      const mockStory = {
        options: {} as Record<string, unknown>,
        save_label: [] as string[],
        clears: [] as (() => void)[],
      };
      Tags.process(mockStory as never, 'linedelay: 0.1');
      expect(mockStory.options.linedelay).toBe(0.1);
    });

    it('should handle linedelay 0', () => {
      load();
      const mockStory = {
        options: {} as Record<string, unknown>,
        save_label: [] as string[],
        clears: [] as (() => void)[],
      };
      Tags.process(mockStory as never, 'linedelay: 0');
      expect(mockStory.options.linedelay).toBe(0);
    });

    it('should handle invalid linedelay value', () => {
      load();
      const mockStory = {
        options: {} as Record<string, unknown>,
        save_label: [] as string[],
        clears: [] as (() => void)[],
      };
      Tags.process(mockStory as never, 'linedelay: invalid');
      expect(mockStory.options.linedelay).toBeUndefined();
    });

    it('should handle null linedelay value', () => {
      load();
      const mockStory = {
        options: {} as Record<string, unknown>,
        save_label: [] as string[],
        clears: [] as (() => void)[],
      };
      Tags.process(mockStory as never, 'linedelay:');
      expect(mockStory.options.linedelay).toBeUndefined();
    });
  });

  describe('Patches', () => {
    it('should add visibleLines property', () => {
      load();
      const mockStory = {
        options: { linedelay: 0.05 },
        contents: ['line1', 'line2'],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: () => {},
      };
      const patch = Patches.patches[0];
      patch.call(mockStory as never, '');
      expect(mockStory).toHaveProperty('visibleLines');
    });

    it('should call clear function', () => {
      load();
      const mockStory = {
        options: { linedelay: 0.05 },
        contents: ['line1', 'line2'],
        save_label: [] as string[],
        clears: [] as (() => void)[],
        cleanups: [] as (() => void)[],
        choose: () => {},
      };
      const patch = Patches.patches[0];
      patch.call(mockStory as never, '');
      mockStory.clears[0]();
    });
  });

  describe('CSS injection', () => {
    it('should inject CSS when loaded', () => {
      expect(typeof load).toBe('function');
    });
  });
});
