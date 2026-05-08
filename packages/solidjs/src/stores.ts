import { createSignal } from "solid-js";

// 通过 getter/setter 封装 createSignal，保持跨框架 API 一致（与 Svelte stores 对齐），
// 避免外部直接暴露 SolidJS 的 [getter, setter] 元组模式。
const _choicesCanShowSignal = createSignal(true);

export function useChoicesCanShow() {
  return {
    get value() {
      return _choicesCanShowSignal[0]();
    },
    set value(v: boolean) {
      _choicesCanShowSignal[1](v);
    },
  };
}
