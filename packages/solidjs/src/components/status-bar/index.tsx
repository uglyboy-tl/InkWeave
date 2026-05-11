import type { InkStory, StatusBarConfig } from "@inkweave/core";
import { variablesStore } from "@inkweave/core";
import { createMemo, createSignal, type JSX, onCleanup, onMount } from "solid-js";
import styles from "./styles.module.css";

interface StatusBarProps {
  ink: InkStory;
  variables: StatusBarConfig[];
  class?: string;
}

const StatusBar = (props: StatusBarProps): JSX.Element => {
  const [version, setVersion] = createSignal(0);

  onMount(() => {
    setVersion(1);
    const unsub = variablesStore.subscribe(() => setVersion((v) => v + 1));
    onCleanup(unsub);
  });

  const allVars = createMemo(() => {
    version();
    return variablesStore.getState().variables;
  });

  const getValue = (key: string): number => {
    const raw = allVars().get(key);
    return typeof raw === "number" ? raw : 0;
  };

  return (
    <div id="inkweave-status-bar" class={`${styles.bar} ${props.class || ""}`}>
      {props.variables.map((cfg) => {
        if (cfg.display === "number") {
          const value = getValue(cfg.key);
          return (
            <div class={styles.item}>
              <span class={styles.label}>{cfg.label}</span>
              <span class={styles.value}>{Math.round(value)}</span>
            </div>
          );
        }

        const percent = variablesStore.getState().getPercent(cfg.key);
        return (
          <div class={styles.item}>
            <span class={styles.label}>{cfg.label}</span>
            <div class={styles.track}>
              <div class={styles.fill} style={{ width: `${percent}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusBar;
