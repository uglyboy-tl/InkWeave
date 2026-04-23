import type { ChoiceComponentProps } from "@inkweave/react";
import { memo, useEffect, useRef } from "react";

const AutoChoice: React.FC<ChoiceComponentProps> = ({
  choice,
  onClick,
  className = "",
  children,
}) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onClickRef = useRef(onClick);
  const cd = parseFloat(choice.val ?? "") || 0;

  onClickRef.current = onClick;

  useEffect(() => {
    if (cd <= 0) return;

    intervalRef.current = setInterval(() => {
      onClickRef.current();
    }, cd * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cd]);

  return (
    <a className={className} style={{ display: "none" }}>
      {children}
    </a>
  );
};

export default memo(AutoChoice);
