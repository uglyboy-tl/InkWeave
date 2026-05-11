import type { InkStory, StatusBarConfig } from "@inkweave/core";
import { variablesStore } from "@inkweave/core";
import { memo, useCallback } from "react";
import styles from "./styles.module.css";

interface StatusBarProps {
  ink: InkStory;
  variables: StatusBarConfig[];
  class?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ ink: _ink, variables, class: className }) => {
  const allVars = variablesStore((s) => s.variables);

  const renderItem = useCallback(
    (cfg: (typeof variables)[number]) => {
      const rawValue = allVars.get(cfg.key);
      const value = typeof rawValue === "number" ? rawValue : 0;

      if (cfg.display === "number") {
        return (
          <div key={cfg.key} className={styles.item}>
            <span className={styles.label}>{cfg.label}</span>
            <span className={styles.value}>{Math.round(value)}</span>
          </div>
        );
      }

      const percent = variablesStore.getState().getPercent(cfg.key);
      return (
        <div key={cfg.key} className={styles.item}>
          <span className={styles.label}>{cfg.label}</span>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${percent}%` }} />
          </div>
        </div>
      );
    },
    [allVars],
  );

  return (
    <div id="inkweave-status-bar" className={[styles.bar, className].filter(Boolean).join(" ")}>
      {variables.map(renderItem)}
    </div>
  );
};

StatusBar.displayName = "StatusBar";
export default memo(StatusBar);
