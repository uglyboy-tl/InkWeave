import { CHOICE_SEPARATOR, type ContentItem, contentsStore } from "@inkweave/core";
import { createMemo, createSignal, onCleanup } from "solid-js";
import { useStory } from "../story";
import styles from "./styles.module.css";

const ContentsComponent = () => {
  const ink = useStory();
  const [contents, setContents] = createSignal([...contentsStore.getState().contents]);

  const unsub = contentsStore.subscribe((state) => {
    setContents([...state.contents]);
  });
  onCleanup(unsub);

  const lineDelay = () => (ink.options.linedelay as number) ?? 0.05;

  const visibleLines = () => {
    const v = contentsStore.getState().visibleLines;
    return v ?? (lineDelay() > 0 ? -1 : contents().length);
  };

  const renderedContents = createMemo(() => {
    const ld = lineDelay();
    const vl = visibleLines();
    const items = contents();

    return items.map((item: ContentItem, i: number) => {
      const delay = `${(i > vl ? i - vl : 0) * ld}s`;
      const isDivider = item.text === CHOICE_SEPARATOR;

      if (isDivider) {
        return (
          <div
            class={ld > 0 ? styles.fade : ""}
            style={ld > 0 ? ({ "--delay": delay } as Record<string, string>) : { opacity: "1" }}
          >
            <hr class="inkweave-divider" />
          </div>
        );
      }

      return (
        <div
          style={ld > 0 ? ({ "--delay": delay } as Record<string, string>) : { opacity: "1" }}
          class={["inkweave-content-line", ...(item.classes ?? []), ld > 0 && styles.fade]
            .filter(Boolean)
            .join(" ")}
        >
          <p>{item.text}</p>
        </div>
      );
    });
  });

  return <section class={`inkweave-contents ${styles.contents}`}>{renderedContents()}</section>;
};

export default ContentsComponent;
