import type { Locale, Namespace } from "./types";

export const locales = ["en-US", "zh-CN"] as const;
export const namespaces = ["common"] as const;
export const defaultLocale: Locale = "en-US";
export const bootNamespaces = ["common"] as const satisfies readonly Namespace[];
