export interface Plugin {
  id: string;
  name?: string;
  description?: string;
  version?: string;
  enabledByDefault?: boolean;
  onLoad: () => void | Promise<void>;
  dependencies?: string[];
}

export interface ChoiceRenderer {
  register(type: string, component: unknown): void;
}
