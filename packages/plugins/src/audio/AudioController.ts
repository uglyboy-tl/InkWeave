export class AudioController {
  private static _sound: HTMLAudioElement | null = null;
  private static _music: HTMLAudioElement | null = null;
  private static _sound_handler: () => void = () => {};
  private static _music_handler: () => void = () => {};

  static get sound() {
    return AudioController._sound;
  }

  static get music() {
    return AudioController._music;
  }

  static get sound_handler() {
    return AudioController._sound_handler;
  }

  static get music_handler() {
    return AudioController._music_handler;
  }

  static set_music(path: string) {
    AudioController._music = new Audio(path);
    AudioController._music.loop = true;
    AudioController._music_handler = () => {
      AudioController._music?.play();
    };
    AudioController._music.addEventListener("canplaythrough", AudioController._music_handler);
  }

  static set_sound(path: string) {
    AudioController._sound = new Audio(path);
    AudioController._sound_handler = () => {
      AudioController._sound?.play();
    };
    AudioController._sound.addEventListener("canplaythrough", AudioController._sound_handler);
  }

  static cleanupSound() {
    if (AudioController._sound) {
      AudioController._sound.pause();
      AudioController._sound.currentTime = 0;
      AudioController._sound.removeEventListener("canplaythrough", AudioController._sound_handler);
      AudioController._sound.src = "";
    }
    AudioController._sound = null;
    AudioController._sound_handler = () => {};
  }

  static cleanupMusic() {
    if (AudioController._music) {
      AudioController._music.pause();
      AudioController._music.currentTime = 0;
      AudioController._music.removeEventListener("canplaythrough", AudioController._music_handler);
      AudioController._music.src = "";
    }
    AudioController._music = null;
    AudioController._music_handler = () => {};
  }
}
