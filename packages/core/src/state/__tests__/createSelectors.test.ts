import { describe, it, expect } from 'vitest';
import createSelectors from '../createSelectors';
import { create } from 'zustand';

describe('createSelectors', () => {
  it('should add use property to store', () => {
    const store = create<{ count: number }>(() => ({
      count: 0,
    }));
    const withSelectors = createSelectors(store);
    expect(withSelectors.use).toBeDefined();
  });

  it('should allow accessing state via use', () => {
    const store = create<{ count: number; increment: () => void }>((set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }));
    const withSelectors = createSelectors(store);
    expect(withSelectors.use.count).toBeDefined();
    expect(withSelectors.use.increment).toBeDefined();
  });
});
