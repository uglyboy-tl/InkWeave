import { CHOICE_SEPARATOR, contentsStore } from "@inkweave/core";
import { createSignal, For, onCleanup } from "solid-js";
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

  return (
    <section class={`inkweave-contents ${styles.contents}`}>
      <For each={contents()}>
        {(item, i) => {
          const vl = visibleLines();
          const ld = lineDelay();
          const delay = `${(i() > vl ? i() - vl : 0) * ld}s`;
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

          const combinedClasses = ["inkweave-content-line"];
          if (item.classes && item.classes.length > 0) {
            combinedClasses.push(...item.classes);
          }
          if (ld > 0 && styles.fade) {
            combinedClasses.push(styles.fade);
          }

          return (
            <div
              style={ld > 0 ? ({ "--delay": delay } as Record<string, string>) : { opacity: "1" }}
              class={combinedClasses.join(" ")}
            >
              <p>{item.text}</p>
            </div>
          );
        }}
      </For>
    </section>
  );
};

export default ContentsComponent;
