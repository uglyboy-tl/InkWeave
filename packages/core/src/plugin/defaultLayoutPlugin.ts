import type { Layout } from "./types";

export const defaultLayoutPlugin: Layout = {
  id: "default-layout",
  name: "Default Layout Plugin",
  description: "Provides the default InkWeave layout",
  onLoad: () => {},
};
