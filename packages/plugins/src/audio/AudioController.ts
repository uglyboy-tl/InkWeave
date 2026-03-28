export class AudioController {
  private static _sound: HTMLAudioElement | null = null;
  private static _music: HTMLAudioElement | null = null;
  private static _sound_handler: () => void = () => {};
  private static _music_handler: () => void = () => {};

  static get sound() {
    return this._sound;
  }

  static get music() {
    return this._music;
  }

  static get sound_handler() {
    return this._sound_handler;
  }

  static get music_handler() {
    return this._music_handler;
  }

  static set_music(path: string) {
    this._music = new Audio(path);
    this._music.loop = true;
    this._music_handler = () => {
      this._music?.play();
    };
    this._music.addEventListener('canplaythrough', this._music_handler);
  }

  static set_sound(path: string) {
    this._sound = new Audio(path);
    this._sound_handler = () => {
      this._sound?.play();
    };
    this._sound.addEventListener('canplaythrough', this._sound_handler);
  }

  static cleanupSound() {
    if (this._sound) {
      this._sound.pause();
      this._sound.currentTime = 0;
      this._sound.removeEventListener('canplaythrough', this._sound_handler);
      this._sound.src = '';
    }
    this._sound = null;
    this._sound_handler = () => {};
  }

  static cleanupMusic() {
    if (this._music) {
      this._music.pause();
      this._music.currentTime = 0;
      this._music.removeEventListener('canplaythrough', this._music_handler);
      this._music.src = '';
    }
    this._music = null;
    this._music_handler = () => {};
  }
}
