import type { InkStory, StatusBarConfig } from "@inkweave/core";
import { variablesStore } from "@inkweave/core";
import { createSignal, type JSX, onCleanup, onMount } from "solid-js";
import styles from "./styles.module.css";

interface StatusBarProps {
  ink: InkStory;
  variables: StatusBarConfig[];
  class?: string;
}

const StatusBar = (props: StatusBarProps): JSX.Element => {
  const [state, setState] = createSignal(variablesStore.getState());

  onMount(() => {
    const unsub = variablesStore.subscribe((s) => setState(s));
    onCleanup(unsub);
  });

  const getValue = (key: string): number => {
    const raw = state().variables.get(key);
    return typeof raw === "number" ? raw : 0;
  };

  const getPercent = (key: string, max = 10): number => {
    return state().getPercent(key, max);
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

        const percent = getPercent(cfg.key);
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
