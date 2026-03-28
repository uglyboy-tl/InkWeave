import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InkStory } from '../InkStory';
import type { Story } from 'inkjs/engine/Story';
import contentsStore from '../../state/contents';
import choicesStore from '../../state/choices';
import { Tags } from '../../extensions/Tags';
import { Parser } from '../../extensions/Parser';
import { ExternalFunctions } from '../../extensions/ExternalFunctions';

describe('InkStory', () => {
  let mockStory: Story;
  let ink: InkStory;

  beforeEach(() => {
    mockStory = {
      canContinue: true,
      Continue: vi.fn().mockReturnValue('Hello'),
      currentTags: [],
      currentChoices: [],
      variablesState: {
        _globalVariables: new Map(),
      },
      ChooseChoiceIndex: vi.fn(),
      ResetState: vi.fn(),
      ToJson: vi.fn().mockReturnValue('{}'),
    } as unknown as Story;
    ink = new InkStory(mockStory, 'Test');

    contentsStore.getState().setContents([]);
    choicesStore.getState().clear();
    Tags.clear();
    Parser.clear();
    ExternalFunctions.clear();
  });

  describe('constructor', () => {
    it('should initialize with title', () => {
      expect(ink.title).toBe('Test');
    });

    it('should set story property', () => {
      expect(ink.story).toBe(mockStory);
    });

    it('should accept custom options', () => {
      const customInk = new InkStory(mockStory, 'Custom', { debug: true, linedelay: 0.1 });
      expect(customInk.options.debug).toBe(true);
      expect(customInk.options.linedelay).toBe(0.1);
    });
  });

  describe('contents', () => {
    it('should get contents', () => {
      expect(ink.contents).toEqual([]);
    });

    it('should set contents', () => {
      ink.contents = ['hello', 'world'];
      expect(ink.contents).toEqual(['hello', 'world']);
    });
  });

  describe('choices', () => {
    it('should get choices', () => {
      expect(ink.choices).toEqual([]);
    });
  });

  describe('save_label', () => {
    it('should have contents label', () => {
      expect(ink.save_label).toContain('contents');
    });
  });

  describe('effects', () => {
    it('should get side effects', () => {
      expect(ink.effects).toEqual([]);
    });
  });

  describe('clears', () => {
    it('should get clear functions', () => {
      expect(ink.clears.length).toBeGreaterThan(0);
    });
  });

  describe('cleanups', () => {
    it('should get cleanup functions', () => {
      expect(ink.cleanups).toEqual([]);
    });
  });

  describe('continue', () => {
    it('should add content from story', () => {
      let callCount = 0;
      (mockStory.Continue as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        if (callCount === 1) return 'Line 1';
        if (callCount === 2) return 'Line 2';
        return null;
      });
      Object.defineProperty(mockStory, 'canContinue', {
        get: () => callCount < 3,
      });

      ink.continue();

      expect(ink.contents).toContain('Line 1');
      expect(ink.contents).toContain('Line 2');
    });

    it('should process tags', () => {
      const tagFn = vi.fn();
      Tags.add('custom', tagFn);
      let callCount = 0;
      (mockStory as unknown as Record<string, unknown>).currentTags = ['custom: value'];
      (mockStory.Continue as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 'Text' : null;
      });
      Object.defineProperty(mockStory, 'canContinue', {
        get: () => callCount < 1,
        configurable: true,
      });

      ink.continue();

      expect(tagFn).toHaveBeenCalledWith('value', ink);
    });

    it('should process text with parser', () => {
      Parser.tag('uppercase', (line: { text: string }) => {
        line.text = line.text.toUpperCase();
      });
      let callCount = 0;
      (mockStory as unknown as Record<string, unknown>).currentTags = ['uppercase'];
      (mockStory.Continue as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        return callCount === 1 ? 'hello' : null;
      });
      Object.defineProperty(mockStory, 'canContinue', {
        get: () => callCount < 1,
        configurable: true,
      });

      ink.continue();

      expect(ink.contents).toContain('HELLO');
    });

    it('should set choices', () => {
      const mockChoices = [
        { text: 'Choice 1', index: 0, tags: null },
        { text: 'Choice 2', index: 1, tags: null },
      ];
      (mockStory as unknown as Record<string, unknown>).currentChoices = mockChoices;
      Object.defineProperty(mockStory, 'canContinue', {
        get: () => false,
        configurable: true,
      });

      ink.continue();

      expect(ink.choices.length).toBe(2);
    });
  });

  describe('choose', () => {
    it('should call ChooseChoiceIndex', () => {
      Object.defineProperty(mockStory, 'canContinue', {
        get: () => false,
        configurable: true,
      });

      ink.choose(0);

      expect(mockStory.ChooseChoiceIndex).toHaveBeenCalledWith(0);
    });

    it('should add choice separator', () => {
      Object.defineProperty(mockStory, 'canContinue', {
        get: () => false,
        configurable: true,
      });

      ink.choose(0);

      expect(ink.contents.length).toBeGreaterThan(0);
    });
  });

  describe('clear', () => {
    it('should call clear functions', () => {
      const fn = vi.fn();
      ink._clears.push(fn);

      ink.clear();

      expect(fn).toHaveBeenCalled();
    });

    it('should clear contents by default', () => {
      ink.contents = ['hello', 'world'];

      ink.clear();

      expect(ink.contents).toEqual([]);
    });
  });

  describe('restart', () => {
    it('should reset story state', () => {
      Object.defineProperty(mockStory, 'canContinue', {
        get: () => false,
        configurable: true,
      });

      ink.restart();

      expect(mockStory.ResetState).toHaveBeenCalled();
    });

    it('should clear contents', () => {
      ink.contents = ['hello', 'world'];
      Object.defineProperty(mockStory, 'canContinue', {
        get: () => false,
        configurable: true,
      });

      ink.restart();

      expect(ink.contents).toEqual([]);
    });
  });

  describe('useEffect', () => {
    it('should call effect functions', () => {
      const fn = vi.fn();
      ink._side_effects.push(fn);
      ink.useEffect();
      expect(fn).toHaveBeenCalled();
    });

    it('should handle null effect', () => {
      ink._side_effects.push(null as unknown as () => void);
      expect(() => ink.useEffect()).not.toThrow();
    });
  });

  describe('dispose', () => {
    it('should call cleanup functions', () => {
      const fn = vi.fn();
      ink._cleanups.push(fn);
      ink.dispose();
      expect(fn).toHaveBeenCalled();
    });

    it('should handle multiple cleanups', () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();
      ink._cleanups.push(fn1, fn2);
      ink.dispose();
      expect(fn1).toHaveBeenCalled();
      expect(fn2).toHaveBeenCalled();
    });

    it('should handle null cleanup', () => {
      ink._cleanups.push(null as unknown as () => void);
      expect(() => ink.dispose()).not.toThrow();
    });
  });

  describe('bindExternalFunctions', () => {
    it('should bind external functions from content', () => {
      const fn = vi.fn();
      ExternalFunctions.add('testFunc', fn);
      (mockStory.ToJson as ReturnType<typeof vi.fn>).mockReturnValue('{"x()":"testFunc"}');
      (mockStory as unknown as Record<string, unknown>).BindExternalFunction = vi.fn();

      new InkStory(mockStory, 'Test');

      expect(mockStory.BindExternalFunction).toHaveBeenCalled();
    });

    it('should handle content without external functions', () => {
      (mockStory.ToJson as ReturnType<typeof vi.fn>).mockReturnValue('{}');

      expect(() => new InkStory(mockStory, 'Test')).not.toThrow();
    });
  });
});
