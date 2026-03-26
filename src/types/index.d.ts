import { Story } from 'inkjs/engine/Story';

export interface InkPlayerOptions {
  container?: string | HTMLElement;
  story: string;
  title?: string;
  theme?: 'light' | 'dark';
  saveSlots?: number;
  lineDelay?: number;
  fadeInDuration?: number;
  basePath?: string;
}

export type CleanupFunction = () => void;
export type SideEffectFunction = () => void;
export type ClearFunction = () => void;

export interface Choice {
  text: string;
  index: number;
  type: string;
  val?: string;
}

export interface SaveData {
  state: string;
  contents?: string[];
  image?: string;
  timestamp?: string;
}

declare global {
  interface Window {
    InkPlayer: {
      init: (options: InkPlayerOptions) => void;
      version: string;
    };
    __INK_PLAYER_OPTIONS__?: InkPlayerOptions;
  }
}

export {};