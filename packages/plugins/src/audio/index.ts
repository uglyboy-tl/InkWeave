import { Events, type FileHandler, type InkStory, Patches, Tags } from "@inkweave/core";
import { AudioController } from "./AudioController";

const getPath = (path: string, fileHandler?: FileHandler) => {
  if (fileHandler && "resolveFilename" in fileHandler) {
    return (fileHandler as { resolveFilename: (f: string) => string }).resolveFilename(path);
  }
  return path;
};

const load = () => {
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
    } else {
      AudioController.cleanupMusic();
    }
  });

  Patches.add(function () {
    this.audio = AudioController;
    const cleanupAudio = () => {
      AudioController.cleanupSound();
      AudioController.cleanupMusic();
    };

    this.eventEmitter.on(Events.STORY_DISPOSE, cleanupAudio);
    this.eventEmitter.on(Events.STORY_RESTART_START, cleanupAudio);
  }, {});
};

export default load;
