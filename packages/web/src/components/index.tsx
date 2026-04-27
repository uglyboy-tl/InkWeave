import type { InkStory } from "@inkweave/core";
import { Image } from "@inkweave/plugins";
import type { TranslationFunction } from "@inkweave/react";
import { CommandBar, Story } from "@inkweave/react";
import { StrictMode } from "react";
import type { Root } from "react-dom/client";
import "@inkweave/react/react.css";
import "@inkweave/plugins/plugins.css";
import styles from "./styles.module.css";

export const render = (root: Root, ink: InkStory, translations?: TranslationFunction) => {
  root.render(
    <StrictMode>
      <div id="inkweave-player" className={styles.container}>
        <nav className={styles.nav}>
          <CommandBar
            ink={ink}
            className={styles.actions}
            buttonClassName={styles.btn}
            modalClassName={styles.modal}
            t={translations}
          />
        </nav>
        <Story ink={ink}>
          <Image />
        </Story>
      </div>
    </StrictMode>,
  );
};
