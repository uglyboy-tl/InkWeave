import { Tags, Patches, type InkStory, type FileHandler } from '@inkweave/core';
import { AudioController } from './AudioController';

const getPath = (path: string, fileHandler?: FileHandler) => {
  if (fileHandler && 'resolveFilename' in fileHandler) {
    return (fileHandler as { resolveFilename: (f: string) => string }).resolveFilename(path);
  }
  return path;
};

const load = () => {
  Tags.add('sound', (val: string | null | undefined, ink: InkStory) => {
    if (val) {
      AudioController.cleanupSound();
      AudioController.set_sound(getPath(val, ink.options.fileHandler));
    } else {
      AudioController.cleanupSound();
    }
  });

  Tags.add('music', (val: string | null | undefined, ink: InkStory) => {
    if (val) {
      AudioController.cleanupMusic();
      AudioController.set_music(getPath(val, ink.options.fileHandler));
    } else {
      AudioController.cleanupMusic();
    }
  });

  Patches.add(function () {
    this.audio = AudioController;
    this.cleanups.push(() => {
      AudioController.cleanupSound();
      AudioController.cleanupMusic();
    });
  }, {});
};

export default load;
