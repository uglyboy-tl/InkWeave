import { describe, it, expect, mock } from 'bun:test';
import load from '../index';
import { Tags, Patches } from '@inkweave/core';
import { AudioController } from '../AudioController';

describe('audio', () => {
  describe('load', () => {
    it('should register sound tag', () => {
      load();
      expect(Tags.functions.has('sound')).toBe(true);
    });

    it('should register music tag', () => {
      load();
      expect(Tags.functions.has('music')).toBe(true);
    });

    it('should register patch', () => {
      load();
      expect(Patches.patches.length).toBeGreaterThan(0);
    });
  });

  describe('AudioController', () => {
    it('should have null sound initially', () => {
      expect(AudioController.sound).toBeNull();
    });

    it('should have null music initially', () => {
      expect(AudioController.music).toBeNull();
    });

    it('should set sound and create Audio instance', () => {
      // Reset first
      AudioController.cleanupSound();

      AudioController.set_sound('click.mp3');
      expect(AudioController.sound).toBeDefined();

      // Cleanup after test
      AudioController.cleanupSound();
    });

    it('should set music and create Audio instance', () => {
      // Reset first
      AudioController.cleanupMusic();

      AudioController.set_music('bgm.mp3');
      expect(AudioController.music).toBeDefined();
      expect(AudioController.music?.loop).toBe(true);

      // Cleanup after test
      AudioController.cleanupMusic();
    });

    it('should cleanup sound without error', () => {
      AudioController.set_sound('click.mp3');
      expect(() => AudioController.cleanupSound()).not.toThrow();
      expect(AudioController.sound).toBeNull();
    });

    it('should cleanup music without error', () => {
      AudioController.set_music('bgm.mp3');
      expect(() => AudioController.cleanupMusic()).not.toThrow();
      expect(AudioController.music).toBeNull();
    });

    it('should process sound tag with null', () => {
      load();
      const mockStory = { options: {}, cleanups: [] };
      Tags.process(mockStory as unknown as Parameters<typeof Tags.process>[0], 'sound');
    });

    it('should process music tag with null', () => {
      load();
      const mockStory = { options: {}, cleanups: [] };
      Tags.process(mockStory as unknown as Parameters<typeof Tags.process>[0], 'music');
    });
  });

  describe('fileHandler integration', () => {
    it('should use fileHandler for sound path resolution', () => {
      load();
      const mockFileHandler = {
        resolveFilename: mock((path: string) => `/base/${path}`),
        loadFile: mock(() => ''),
      };
      const mockStory = {
        options: { fileHandler: mockFileHandler },
        cleanups: [],
      };
      Tags.process(mockStory as unknown as Parameters<typeof Tags.process>[0], 'sound: click.mp3');
      expect(mockFileHandler.resolveFilename).toHaveBeenCalledWith('click.mp3');
    });

    it('should use fileHandler for music path resolution', () => {
      load();
      const mockFileHandler = {
        resolveFilename: mock((path: string) => `/base/${path}`),
        loadFile: mock(() => ''),
      };
      const mockStory = {
        options: { fileHandler: mockFileHandler },
        cleanups: [],
      };
      Tags.process(mockStory as unknown as Parameters<typeof Tags.process>[0], 'music: bgm.mp3');
      expect(mockFileHandler.resolveFilename).toHaveBeenCalledWith('bgm.mp3');
    });

    it('should handle path without fileHandler', () => {
      load();
      const mockStory = {
        options: {},
        cleanups: [],
      };
      Tags.process(mockStory as unknown as Parameters<typeof Tags.process>[0], 'sound: click.mp3');
    });
  });
});
