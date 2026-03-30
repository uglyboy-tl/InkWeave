import type { Choice as InkChoice } from "inkjs/engine/Choice";
import { create } from "zustand";
import { ChoiceParser } from "../extensions/ChoiceParser";
import { Choice } from "../types";
import createSelectors from "./createSelectors";

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
      if (choice.tags?.length) {
        ChoiceParser.process(choice, new_choice);
      }
      return new_choice;
    });
    set({ choices });
  },
  clear: () => set({ choices: [] }),
}));

export default createSelectors(choicesStore);
