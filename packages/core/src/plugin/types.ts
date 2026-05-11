interface Base {
  id: string;
  name?: string;
  description?: string;
  version?: string;
  onLoad: () => void | Promise<void>;
}

export interface Layout extends Base {
  injectClassName?: string;
  /** 启用此布局时自动禁用的插件 */
  exclude?: string[];
}

export interface Plugin extends Base {
  enabledByDefault?: boolean;
  dependencies?: string[];
}

export interface ChoiceRenderer {
  register(type: string, component: unknown): void;
}
