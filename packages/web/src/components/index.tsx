import type { InkStory } from "@inkweave/core";
import { Image } from "@inkweave/plugins";
import { Story } from "@inkweave/react";
import { StrictMode } from "react";
import type { Root } from "react-dom/client";
import Menu from "./Menu";
import "@inkweave/react/react.css";
import "@inkweave/plugins/plugins.css";
import styles from "./styles.module.css";

export const render = (root: Root, ink: InkStory) => {
  root.render(
    <StrictMode>
      <div id="inkweave-player" className={styles.container}>
        <Menu ink={ink} />
        <Story ink={ink}>
          <Image />
        </Story>
      </div>
    </StrictMode>,
  );
};
