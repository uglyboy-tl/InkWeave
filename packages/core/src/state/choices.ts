import type { Choice as InkChoice } from "inkjs/engine/Choice";
import { create } from "zustand";
import { ChoiceHandler } from "../story/ChoiceHandler";
import { Choice } from "../types";

type StoryChoices = {
  choices: Choice[];
  choicesVisible: boolean;
  setChoices: (choices: InkChoice[]) => void;
  clear: () => void;
  setChoicesVisible: (v: boolean) => void;
};

const choicesStore = create<StoryChoices>((set) => ({
  choices: [],
  choicesVisible: true,
  setChoices: (ink_choices) => {
    const choices = ink_choices.map((choice) => {
      const new_choice = new Choice(choice.text, choice.index);
      if (choice.tags?.length) {
        ChoiceHandler.process(choice, new_choice);
      }
      return new_choice;
    });
    set({ choices });
  },
  clear: () => set({ choices: [], choicesVisible: true }),
  setChoicesVisible: (choicesVisible) => set({ choicesVisible }),
}));

export default choicesStore;
