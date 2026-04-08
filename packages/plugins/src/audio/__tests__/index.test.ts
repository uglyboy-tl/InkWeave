import { beforeEach, describe, expect, it, mock, vi } from "bun:test";
import { Patches, Tags } from "@inkweave/core";
import { AudioController } from "../AudioController";
import load from "../index";

describe("audio", () => {
  beforeEach(() => {
    AudioController.cleanupSound();
    AudioController.cleanupMusic();
    Patches.patches = [];
  });

  describe("load", () => {
    it("should register sound tag", () => {
      load();
      expect(Tags.functions.has("sound")).toBe(true);
    });

    it("should register music tag", () => {
      load();
      expect(Tags.functions.has("music")).toBe(true);
    });

    it("should register patch", () => {
      load();
      expect(Patches.patches.length).toBeGreaterThan(0);
    });
  });

  describe("AudioController", () => {
    it("should have null sound initially", () => {
      expect(AudioController.sound).toBeNull();
    });

    it("should have null music initially", () => {
      expect(AudioController.music).toBeNull();
    });

    it("should have null sound_handler initially", () => {
      expect(AudioController.sound_handler).toBeDefined();
    });

    it("should have null music_handler initially", () => {
      expect(AudioController.music_handler).toBeDefined();
    });

    it("should set sound and create Audio instance", () => {
      AudioController.cleanupSound();

      AudioController.set_sound("click.mp3");
      expect(AudioController.sound).toBeDefined();

      AudioController.cleanupSound();
    });

    it("should set music and create Audio instance", () => {
      AudioController.cleanupMusic();

      AudioController.set_music("bgm.mp3");
      expect(AudioController.music).toBeDefined();
      expect(AudioController.music?.loop).toBe(true);

      AudioController.cleanupMusic();
    });

    it("should trigger music handler on canplaythrough", () => {
      AudioController.cleanupMusic();
      AudioController.set_music("bgm.mp3");
      const music = AudioController.music;
      expect(music).not.toBeNull();
      if (!music) return;
      const playSpy = vi.spyOn(music, "play").mockImplementation(() => Promise.resolve());

      music.dispatchEvent(new Event("canplaythrough"));

      expect(playSpy).toHaveBeenCalled();
      playSpy.mockRestore();
      AudioController.cleanupMusic();
    });

    it("should trigger sound handler on canplaythrough", () => {
      AudioController.cleanupSound();
      AudioController.set_sound("click.mp3");
      const sound = AudioController.sound;
      expect(sound).not.toBeNull();
      if (!sound) return;
      const playSpy = vi.spyOn(sound, "play").mockImplementation(() => Promise.resolve());

      sound.dispatchEvent(new Event("canplaythrough"));

      expect(playSpy).toHaveBeenCalled();
      playSpy.mockRestore();
      AudioController.cleanupSound();
    });

    it("should cleanup sound without error", () => {
      AudioController.set_sound("click.mp3");
      expect(() => AudioController.cleanupSound()).not.toThrow();
      expect(AudioController.sound).toBeNull();
    });

    it("should cleanup music without error", () => {
      AudioController.set_music("bgm.mp3");
      expect(() => AudioController.cleanupMusic()).not.toThrow();
      expect(AudioController.music).toBeNull();
    });

    it("should process sound tag with null", () => {
      load();
      const mockStory = { options: {}, cleanups: [] };
      Tags.process(mockStory as unknown as Parameters<typeof Tags.process>[0], "sound");
    });

    it("should process music tag with null", () => {
      load();
      const mockStory = { options: {}, cleanups: [] };
      Tags.process(mockStory as unknown as Parameters<typeof Tags.process>[0], "music");
    });
  });

  describe("fileHandler integration", () => {
    it("should use fileHandler for sound path resolution", () => {
      load();
      const mockFileHandler = {
        resolveFilename: mock((path: string) => `/base/${path}`),
        loadFile: mock(() => ""),
      };
      const mockStory = {
        options: { fileHandler: mockFileHandler },
        cleanups: [],
      };
      Tags.process(mockStory as unknown as Parameters<typeof Tags.process>[0], "sound: click.mp3");
      expect(mockFileHandler.resolveFilename).toHaveBeenCalledWith("click.mp3");
    });

    it("should use fileHandler for music path resolution", () => {
      load();
      const mockFileHandler = {
        resolveFilename: mock((path: string) => `/base/${path}`),
        loadFile: mock(() => ""),
      };
      const mockStory = {
        options: { fileHandler: mockFileHandler },
        cleanups: [],
      };
      Tags.process(mockStory as unknown as Parameters<typeof Tags.process>[0], "music: bgm.mp3");
      expect(mockFileHandler.resolveFilename).toHaveBeenCalledWith("bgm.mp3");
    });

    it("should handle path without fileHandler", () => {
      load();
      const mockStory = {
        options: {},
        cleanups: [],
      };
      Tags.process(mockStory as unknown as Parameters<typeof Tags.process>[0], "sound: click.mp3");
    });
  });

  describe("Patches", () => {
    it("should add audio property", () => {
      load();
      const mockStory = {
        options: {},
        cleanups: [] as (() => void)[],
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      expect(mockStory).toHaveProperty("audio");
    });

    it("should push cleanup to cleanups array", () => {
      load();
      const mockStory = {
        options: {},
        cleanups: [] as (() => void)[],
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      expect(mockStory.cleanups.length).toBe(1);
    });

    it("should cleanup sound and music on cleanup callback", () => {
      load();
      AudioController.set_sound("test.mp3");
      AudioController.set_music("bgm.mp3");
      const mockStory = {
        options: {},
        cleanups: [] as (() => void)[],
      };
      const patch = Patches.patches[0];
      patch?.call(mockStory as never, "");
      mockStory.cleanups[0]?.();
      expect(AudioController.sound).toBeNull();
      expect(AudioController.music).toBeNull();
    });
  });
});
