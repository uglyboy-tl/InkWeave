import { CHOICE_SEPARATOR, contentsStore } from "@inkweave/core";
import { createSignal, For, onCleanup } from "solid-js";
import { useLineDelay } from "../../stores";
import { useStory } from "../story";
import styles from "./styles.module.css";

const ContentsComponent = () => {
  const ink = useStory();
  const lineDelayStore = useLineDelay();
  const [contents, setContents] = createSignal([...contentsStore.getState().contents]);

  const unsub = contentsStore.subscribe((state) => {
    setContents([...state.contents]);
  });
  onCleanup(unsub);

  const visibleLines = () => {
    const v = ink.visibleLines;
    return typeof v === "number" ? v : contents().length;
  };

  return (
    <section class={`inkweave-contents ${styles.contents}`}>
      <For each={contents()}>
        {(item, i) => {
          const vl = visibleLines();
          const delay = `${(i() > vl ? i() - vl : 0) * lineDelayStore.value}s`;
          const isDivider = item.text === CHOICE_SEPARATOR;

          if (isDivider) {
            return (
              <div
                class={lineDelayStore.value > 0 ? styles.fade : ""}
                style={
                  lineDelayStore.value > 0
                    ? ({ "--delay": delay } as Record<string, string>)
                    : { opacity: "1" }
                }
              >
                <hr class="inkweave-divider" />
              </div>
            );
          }

          const combinedClasses = ["inkweave-content-line"];
          if (item.classes && item.classes.length > 0) {
            combinedClasses.push(...item.classes);
          }
          if (lineDelayStore.value > 0 && styles.fade) {
            combinedClasses.push(styles.fade);
          }

          return (
            <div
              style={
                lineDelayStore.value > 0
                  ? ({ "--delay": delay } as Record<string, string>)
                  : { opacity: "1" }
              }
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
