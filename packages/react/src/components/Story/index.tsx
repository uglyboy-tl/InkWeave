import type { InkStory } from "@inkweave/core";
import { createContext, memo, use, useEffect, useRef } from "react";
import Choices from "../Choices";
import Contents from "../Contents";
import styles from "./styles.module.css";

const StoryContext = createContext<InkStory | null>(null);

export const useStory = () => {
  const ink = use(StoryContext);
  if (!ink) {
    throw new Error("useStory must be used within StoryProvider");
  }
  return ink;
};

interface StoryProviderProps {
  ink: InkStory;
  children?: React.ReactNode;
}

export const StoryProvider = memo(({ ink, children }: StoryProviderProps) => {
  return <StoryContext.Provider value={ink}>{children}</StoryContext.Provider>;
});

StoryProvider.displayName = "StoryProvider";

interface StoryProps {
  ink: InkStory;
  children?: React.ReactNode;
  className?: string;
  onInit?: (ink: InkStory) => void;
}

const StoryComponent: React.FC<StoryProps> = ({ ink, children, className = "", onInit }) => {
  const onInitRef = useRef(onInit);
  onInitRef.current = onInit;

  useEffect(() => {
    ink.continue();
    onInitRef.current?.(ink);
  }, [ink]);

  return (
    <StoryProvider ink={ink}>
      <div className={`inkweave-story ${styles.story} ${className}`.trim()} data-inkweave="story">
        {children}
        <Contents />
        <Choices />
      </div>
    </StoryProvider>
  );
};

export default memo(StoryComponent);
