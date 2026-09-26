import type { Locale, Namespace } from "./types";

export const locales = ["en-US", "zh-CN"] as const;
export const namespaces = ["common", "dashboard"] as const;
export const defaultLocale: Locale = "en-US";
export const dictPageMap = {
  common: "/",
  dashboard: "/dashboard",
} as const satisfies Record<Namespace, string>;
