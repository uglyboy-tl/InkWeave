import type { Plugin } from "@inkweave/core";
import { Events, type FileHandler, type InkStory, Patches, Tags } from "@inkweave/core";
import { create } from "zustand";
import { AudioController } from "./AudioController";

type StoryMusic = {
  music: string;
  setMusic: (music: string) => void;
};

export const useStoryMusic = create<StoryMusic>((set) => ({
  music: "",
  setMusic: (music) => set({ music }),
}));

const getPath = (path: string, fileHandler?: FileHandler) => {
  if (fileHandler?.resolveFilename) {
    return fileHandler.resolveFilename(path);
  }
  return path;
};

export const audioPlugin: Plugin = {
  id: "audio",
  name: "Audio Plugin",
  description: "Provides sound and music functionality for ink stories",
  enabledByDefault: true,
  onLoad: () => {
    // 在这里不能直接访问ink实例，因为onLoad没有参数
    // 我们需要通过标签和补丁系统来工作，它们会在运行时接收ink实例
    Tags.add("sound", (val: string | null | undefined, ink: InkStory) => {
      if (val) {
        AudioController.cleanupSound();
        AudioController.set_sound(getPath(val, ink.options.fileHandler));
      } else {
        AudioController.cleanupSound();
      }
    });

    Tags.add("music", (val: string | null | undefined, ink: InkStory) => {
      if (val) {
        AudioController.cleanupMusic();
        AudioController.set_music(getPath(val, ink.options.fileHandler));
        useStoryMusic.getState().setMusic(getPath(val, ink.options.fileHandler));
      } else {
        AudioController.cleanupMusic();
      }
    });

    Patches.add(function () {
      Object.defineProperty(this, "music", {
        get() {
          return useStoryMusic.getState().music;
        },
        set(path: string) {
          useStoryMusic.getState().setMusic(path);
          // 如果设置了音乐路径且当前没有音乐在播放，则启动播放
          if (path && !AudioController.music) {
            AudioController.set_music(path);
          }
        },
      });
      this.save_label.push("music");
      this.audio = AudioController;

      const cleanupAudio = () => {
        AudioController.cleanupSound();
        AudioController.cleanupMusic();
      };

      this.eventEmitter.on(Events.STORY_DISPOSE, cleanupAudio);
      this.eventEmitter.on(Events.STORY_RESTART_START, cleanupAudio);
    }, {});
  },
};
