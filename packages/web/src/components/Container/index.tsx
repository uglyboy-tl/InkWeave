import { Image } from "@inkweave/plugins";
import { Story } from "@inkweave/react";
import { memo } from "react";
import type { ContainerProps } from "../../types";

import Menu from "../Menu";
import "@inkweave/react/react.css";
import "@inkweave/plugins/plugins.css";
import styles from "./styles.module.css";

const Container = ({ ink }: ContainerProps) => {
  return (
    <div id="inkweave-player" className={styles.container}>
      <Menu ink={ink} />
      <Story ink={ink}>
        <Image />
      </Story>
    </div>
  );
};

export default memo(Container);
