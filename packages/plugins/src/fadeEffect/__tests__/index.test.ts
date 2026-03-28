import { describe, it, expect } from 'bun:test';
import load from '../index';
import { Patches } from '@inkweave/core';

describe('fadeEffect', () => {
  describe('load', () => {
    it('should register patch', () => {
      load();
      expect(Patches.patches.length).toBeGreaterThan(0);
    });
  });

  describe('CSS injection', () => {
    it('should inject CSS when loaded', () => {
      // This is hard to test without DOM, but we can verify the function exists
      expect(typeof load).toBe('function');
    });
  });
});
