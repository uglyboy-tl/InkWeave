import type { InkStory } from "@inkweave/core";
import { StrictMode } from "react";
import type { Root } from "react-dom/client";
import Container from "./Container/index";

export const renderInkWeave = (root: Root, ink: InkStory) => {
  root.render(
    <StrictMode>
      <Container ink={ink} />
    </StrictMode>,
  );
};
