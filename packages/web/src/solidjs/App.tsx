import type { InkStory, TranslationFunction } from "@inkweave/core";
import { Image } from "@inkweave/plugins/solidjs";
import { CommandBar, Story } from "@inkweave/solidjs";
import "@inkweave/solidjs/solidjs.css";
import "@inkweave/plugins/plugins.css";
import "../global.css";

interface AppProps {
  ink: InkStory;
  translations?: TranslationFunction;
}

const App = (props: AppProps) => {
  return (
    <div id="inkweave-player">
      <nav>
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
