import { CHOICE_SEPARATOR, type ContentItem, contentsStore } from "@inkweave/core";
import { type CSSProperties, memo, useMemo } from "react";
import { useStory } from "../story";
import styles from "./styles.module.css";

const ContentsComponent = () => {
  const ink = useStory();
  const contents = contentsStore((state) => state.contents);
  const lineDelay = (ink.options.linedelay as number) ?? 0.05;
  const storedVisibleLines = contentsStore((state) => state.visibleLines);
  const visibleLines = storedVisibleLines ?? (lineDelay > 0 ? -1 : contents.length);

  const renderedContents = useMemo(() => {
    return contents.map((item: ContentItem, i: number) => {
      const isDivider = item.text === CHOICE_SEPARATOR;
      const key = isDivider ? `divider_${i}` : `line_${i}_${item.text.slice(0, 20)}`;
      const hasFade = lineDelay > 0;
      const delay = `${(i > visibleLines ? i - visibleLines : 0) * lineDelay}s`;

      if (isDivider) {
        return (
          <div
            key={key}
            className={hasFade ? styles.fade : ""}
            style={hasFade ? ({ "--delay": delay } as CSSProperties) : { opacity: "1" }}
          >
            <hr className="inkweave-divider" />
          </div>
        );
      }

      const combinedClasses = ["inkweave-content-line"];
      if (item.classes && item.classes.length > 0) {
        combinedClasses.push(...item.classes);
      }
      if (hasFade && styles.fade) {
        combinedClasses.push(styles.fade);
      }

      return (
        <div
          key={key}
          className={combinedClasses.join(" ")}
          style={hasFade ? ({ "--delay": delay } as CSSProperties) : { opacity: "1" }}
        >
          <p>{item.text}</p>
        </div>
      );
    });
  }, [contents, visibleLines, lineDelay]);

  return <section className={`inkweave-contents ${styles.contents}`}>{renderedContents}</section>;
};

export default memo(ContentsComponent);
