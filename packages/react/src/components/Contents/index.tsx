import { CHOICE_SEPARATOR, type ContentItem, contentsStore } from "@inkweave/core";
import { type CSSProperties, memo, useMemo } from "react";
import { useStory } from "../Story";
import styles from "./styles.module.css";

const ContentsComponent = () => {
  const ink = useStory();
  const contents = contentsStore((state) => state.contents);
  const inkRecord = ink as unknown as Record<string, unknown>;
  const visibleLines =
    inkRecord?.visibleLines !== undefined ? (inkRecord.visibleLines as number) : contents.length;
  const lineDelay = (ink.options.linedelay as number) ?? 0.05;

  const renderedContents = useMemo(() => {
    return contents.map((item: ContentItem, i: number) => {
      const style: CSSProperties = {
        "--delay": `${(i > visibleLines ? i - visibleLines : 0) * lineDelay}s`,
      } as CSSProperties & { "--delay": string };

      const isDivider = item.text === CHOICE_SEPARATOR;
      const key = isDivider ? `divider_${i}` : `line_${i}_${item.text.slice(0, 20)}`;

      if (isDivider) {
        return (
          <div key={key} style={style}>
            <hr className="inkweave-divider" />
          </div>
        );
      }

      // 合并基础类名和动态类名
      const combinedClasses = ["inkweave-content-line"];
      if (item.classes && item.classes.length > 0) {
        combinedClasses.push(...item.classes);
      }

      return (
        <div key={key} style={style} className={combinedClasses.join(" ")}>
          <p>{item.text}</p>
        </div>
      );
    });
  }, [contents, visibleLines, lineDelay]);

  return <section className={`inkweave-contents ${styles.contents}`}>{renderedContents}</section>;
};

export default memo(ContentsComponent);
