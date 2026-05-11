import type { InkStory, StatusBarConfig, TranslationFunction } from "@inkweave/core";
import { Image } from "@inkweave/plugins/react";
import { CommandBar, StatusBar, Story } from "@inkweave/react";
import { StrictMode } from "react";
import type { Root } from "react-dom/client";
import "@inkweave/react/react.css";
import "@inkweave/plugins/react.css";
import "../global.css";

export const render = (
  root: Root,
  ink: InkStory,
  translations?: TranslationFunction,
  statusBar?: StatusBarConfig[],
) => {
  root.render(
    <StrictMode>
      <div id="inkweave-player">
        <nav>
          {statusBar && <StatusBar ink={ink} variables={statusBar} />}
          <CommandBar
            ink={ink}
            class="inkweave-command-bar"
            buttonClass="inkweave-cmd-btn"
            modalClass="modal"
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
