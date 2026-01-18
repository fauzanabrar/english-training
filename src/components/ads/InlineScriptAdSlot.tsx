"use client";

import { useEffect, useRef, useState } from "react";
import { storage } from "@/lib/storage";

export type InlineScriptAdConfig = {
  enabled: boolean;
  containerId: string;
  scriptId: string;
  scriptSrc: string;
  frequencyStorageKey?: string;
  minIntervalMs?: number;
  sessionStorageKey?: string;
  ariaLabel?: string;
};

type InlineScriptAdSlotProps = {
  config: InlineScriptAdConfig;
  className?: string;
};

export function InlineScriptAdSlot({
  config,
  className,
}: InlineScriptAdSlotProps) {
  const injectedRef = useRef(false);
  const shouldThrottle = Boolean(
    config.frequencyStorageKey &&
      config.minIntervalMs &&
      config.minIntervalMs > 0
  );
  const [shouldShow] = useState(() => {
    if (!config.enabled) {
      return false;
    }
    if (
      shouldThrottle &&
      config.frequencyStorageKey &&
      config.minIntervalMs &&
      hasRecentAd(config.frequencyStorageKey, config.minIntervalMs)
    ) {
      return false;
    }
    if (!config.sessionStorageKey) {
      return true;
    }
    return !storage.readSession(config.sessionStorageKey);
  });

  useEffect(() => {
    if (!config.enabled || !shouldShow || injectedRef.current) {
      return;
    }
    if (typeof document === "undefined") {
      return;
    }
    const container = document.getElementById(config.containerId);
    if (!container) {
      return;
    }
    if (document.getElementById(config.scriptId)) {
      injectedRef.current = true;
      recordAdDisplay(config, shouldThrottle);
      return;
    }
    const script = document.createElement("script");
    script.id = config.scriptId;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = config.scriptSrc;
    const target = container.parentElement ?? document.body;
    target.appendChild(script);
    injectedRef.current = true;
    recordAdDisplay(config, shouldThrottle);
  }, [config, shouldShow, shouldThrottle]);

  if (!config.enabled || !shouldShow) {
    return null;
  }

  return (
    <section className={className} aria-label={config.ariaLabel}>
      <div id={config.containerId} />
    </section>
  );
}

const hasRecentAd = (storageKey: string, minIntervalMs: number) => {
  const lastShown = storage.readString(storageKey);
  if (!lastShown) {
    return false;
  }
  const previousTimestamp = Number(lastShown);
  if (Number.isNaN(previousTimestamp)) {
    return false;
  }
  return Date.now() - previousTimestamp < minIntervalMs;
};

const recordAdDisplay = (
  config: InlineScriptAdConfig,
  shouldThrottle: boolean
) => {
  if (config.sessionStorageKey) {
    storage.writeSession(config.sessionStorageKey, "true");
  }
  if (
    shouldThrottle &&
    config.frequencyStorageKey &&
    config.minIntervalMs &&
    config.minIntervalMs > 0
  ) {
    storage.writeString(config.frequencyStorageKey, Date.now().toString());
  }
};
