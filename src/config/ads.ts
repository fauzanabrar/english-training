import { featureFlags } from "./features";

export const adsConfig = {
  enabled: featureFlags.ads.enabled,
  popUnder: {
    enabled: featureFlags.ads.popUnder,
    scriptSrc:
      "https://pl28480662.effectivegatecpm.com/5b/9e/bf/5b9ebf11a1c5d7a7e97f435c53621ae2.js",
    scriptId: "pop-under-ad-script",
    frequencyStorageKey: "popUnderAdLastShown",
    minIntervalMs: 300_000,
  },
  inline: {
    enabled: featureFlags.ads.inline,
    containerId: "container-821c14a503f59465b6bdbdc28b20b678",
    scriptId: "adsterra-native-821c14a503f59465b6bdbdc28b20b678",
    scriptSrc:
      "https://pl28511765.effectivegatecpm.com/821c14a503f59465b6bdbdc28b20b678/invoke.js",
    frequencyStorageKey: "inlineAdLastShown",
    minIntervalMs: 600_000,
    sessionStorageKey: "inlineAdShown",
    ariaLabel: "Sponsored content",
  },
};
