import type { Plugin } from "@inkweave/core";
import { Tags } from "@inkweave/core";

const ALLOWED_PROTOCOLS = ["http:", "https:"];

export const linkOpenPlugin: Plugin = {
  id: "linkopen",
  name: "Link Open Plugin",
  description: "Provides functionality to open links from ink stories",
  enabledByDefault: true,
  onLoad: () => {
    Tags.add("linkopen", (val: string | null | undefined) => {
      if (val) {
        try {
          const url = new URL(val);
          if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
            console.warn("InkWeave: Blocked unsafe URL protocol:", url.protocol);
            return;
          }
        } catch {
          console.warn("InkWeave: Invalid URL:", val);
          return;
        }
        window.open(val, "_blank", "noopener,noreferrer");
      }
    });
  },
};
