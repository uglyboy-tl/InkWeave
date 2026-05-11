import type { InkStory } from "@inkweave/core";
import { createContext, type JSX, onMount, useContext } from "solid-js";
import Choices from "../choices";
import Contents from "../contents";
import styles from "./styles.module.css";

const StoryContext = createContext<InkStory | null>(null);

export const useStory = () => {
  const ink = useContext(StoryContext);
  if (!ink) {
    throw new Error("useStory must be used within StoryProvider");
  }
  return ink;
};

interface StoryProviderProps {
  ink: InkStory;
  children?: JSX.Element;
}

export const StoryProvider = (props: StoryProviderProps) => {
  return <StoryContext.Provider value={props.ink}>{props.children}</StoryContext.Provider>;
};

interface StoryProps {
  ink: InkStory;
  children?: JSX.Element;
  class?: string;
  onInit?: (ink: InkStory) => void;
}

const Story = (props: StoryProps) => {
  onMount(() => {
    props.ink.continue();
    props.onInit?.(props.ink);
  });

  const displayClass = () => props.ink.pluginLoader.activeDisplayClassName ?? "";

  return (
    <StoryProvider ink={props.ink}>
      <div
        id="inkweave-story"
        class={`${styles.story} ${displayClass()} ${props.class || ""}`}
        data-inkweave="story"
      >
        {props.children}
        <Contents />
        <Choices />
      </div>
    </StoryProvider>
  );
};

export default Story;
