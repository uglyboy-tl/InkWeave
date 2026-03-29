import { describe, it, expect } from 'bun:test';
import contentsStore from '../contents';
import { CHOICE_SEPARATOR } from '../../types';

describe('contentsStore', () => {
  describe('initial state', () => {
    it('should have empty contents', () => {
      const { contents } = contentsStore.getState();
      expect(contents).toEqual([]);
    });
  });

  describe('setContents', () => {
    it('should set contents', () => {
      contentsStore.getState().setContents(['hello', 'world']);
      const { contents } = contentsStore.getState();
      expect(contents).toEqual(['hello', 'world']);
    });
  });

  describe('add', () => {
    it('should add content', () => {
      contentsStore.getState().setContents([]);
      contentsStore.getState().add(['hello']);
      contentsStore.getState().add(['world']);
      const { contents } = contentsStore.getState();
      expect(contents).toEqual(['hello', 'world']);
    });
  });

  describe('CHOICE_SEPARATOR', () => {
    it('should be defined', () => {
      expect(CHOICE_SEPARATOR).toBeDefined();
      expect(typeof CHOICE_SEPARATOR).toBe('string');
    });
  });
});
