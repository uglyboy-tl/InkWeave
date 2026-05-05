import type { InkStory, TranslationFunction } from "@inkweave/core";
import { Image } from "@inkweave/plugins/react";
import { CommandBar, Story } from "@inkweave/react";
import { StrictMode } from "react";
import type { Root } from "react-dom/client";
import "@inkweave/react/react.css";
import "@inkweave/plugins/plugins.css";
import "../global.css";

export const render = (root: Root, ink: InkStory, translations?: TranslationFunction) => {
  root.render(
    <StrictMode>
      <div id="inkweave-player">
        <nav>
          <CommandBar
            ink={ink}
            className="inkweave-command-bar"
            buttonClassName="inkweave-cmd-btn"
            modalClassName="modal"
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
