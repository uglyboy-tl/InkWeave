import type { InkStory, StatusBarConfig, TranslationFunction } from "@inkweave/core";
import { Image } from "@inkweave/plugins/solidjs";
import { CommandBar, StatusBar, Story } from "@inkweave/solidjs";
import "@inkweave/solidjs/solidjs.css";
import "@inkweave/plugins/solidjs.css";
import "../global.css";

interface AppProps {
  ink: InkStory;
  translations?: TranslationFunction;
  statusBar?: StatusBarConfig[];
}

const App = (props: AppProps) => {
  return (
    <div id="inkweave-player">
      <nav>
        {props.statusBar && <StatusBar ink={props.ink} variables={props.statusBar} />}
        <CommandBar
          ink={props.ink}
          class="inkweave-command-bar"
          buttonClass="inkweave-cmd-btn"
          modalClass="modal"
          t={props.translations}
        />
      </nav>
      <Story ink={props.ink}>
        <Image />
      </Story>
    </div>
  );
};

export default App;
