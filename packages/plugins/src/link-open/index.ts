import type { Plugin } from "@inkweave/core";
import { Tags } from "@inkweave/core";

const ALLOWED_PROTOCOLS = ["http:", "https:"];

export const linkOpenPlugin: Plugin = {
  id: "link-open",
  name: "Link Open Plugin",
  description: "Provides functionality to open links from ink stories",
  enabledByDefault: true,
  onLoad: () => {
    Tags.add("linkopen", (val: string | null | undefined) => {
      if (!val) return;
      let url: URL;
      try {
        url = new URL(val);
      } catch {
        console.warn("InkWeave: Invalid URL:", val);
        return;
      }
      if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
        console.warn("InkWeave: Blocked unsafe URL protocol:", url.protocol);
        return;
      }
      window.open(url.href, "_blank", "noopener,noreferrer");
    });
  },
};
