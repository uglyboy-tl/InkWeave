import { CHOICE_SEPARATOR, type ContentItem, contentsStore } from "@inkweave/core";
import { createSignal, For, onCleanup } from "solid-js";
import { useStory } from "../story";
import styles from "./styles.module.css";

const ContentsComponent = () => {
  const ink = useStory();
  const [contents, setContents] = createSignal([...contentsStore.getState().contents]);
  const [visibleLines, setVisibleLines] = createSignal<number | null>(
    contentsStore.getState().visibleLines,
  );
  const [lineDelay, setLineDelay] = createSignal((ink.options.linedelay as number) ?? 0.05);

  const unsub = contentsStore.subscribe((state) => {
    setLineDelay((ink.options.linedelay as number) ?? 0.05);
    setVisibleLines(state.visibleLines);
    setContents([...state.contents]);
  });
  onCleanup(unsub);

  return (
    <section class={`inkweave-contents ${styles.contents}`}>
      <For each={contents()}>
        {(item: ContentItem, i) => {
          const isDivider = item.text === CHOICE_SEPARATOR;

          if (isDivider) {
            return (
              <div
                class={lineDelay() > 0 ? styles.fade : ""}
                style={
                  lineDelay() > 0
                    ? ({
                        "--delay": `${(i() > (visibleLines() ?? -1) ? i() - (visibleLines() ?? -1) : 0) * lineDelay()}s`,
                      } as Record<string, string>)
                    : { opacity: "1" }
                }
              >
                <hr class="inkweave-divider" />
              </div>
            );
          }

          return (
            <div
              style={
                lineDelay() > 0
                  ? ({
                      "--delay": `${(i() > (visibleLines() ?? -1) ? i() - (visibleLines() ?? -1) : 0) * lineDelay()}s`,
                    } as Record<string, string>)
                  : { opacity: "1" }
              }
              class={[
                "inkweave-content-line",
                ...(item.classes ?? []),
                lineDelay() > 0 && styles.fade,
              ]
                .filter(Boolean)
                .join(" ")}
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
