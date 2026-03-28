import { create } from 'zustand';
import createSelectors from './createSelectors';
import { Choice } from '../types';
import { ChoiceParser } from '../extensions/ChoiceParser';
import type { Choice as InkChoice } from 'inkjs/engine/Choice';

type StoryChoices = {
  choices: Choice[];
  setChoices: (choices: InkChoice[]) => void;
  clear: () => void;
};

const choicesStore = create<StoryChoices>((set) => ({
  choices: [],
  setChoices: (ink_choices) => {
    const choices = ink_choices.map((choice) => {
      const new_choice = new Choice(choice.text, choice.index);
      if (choice.tags && choice.tags.length) {
        ChoiceParser.process(choice, new_choice);
      }
      return new_choice;
    });
    set({ choices });
  },
  clear: () => set({ choices: [] }),
}));

export default createSelectors(choicesStore);
