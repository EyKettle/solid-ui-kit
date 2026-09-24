import { Locale } from "./types";
import { defaultLocale } from "./config";

export function pickLocale(source: {
  path?: string;
  cookie?: string;
  acceptLanguage?: string;
  navigator?: string;
}): Locale {
  return (
    matchLocale(source.cookie) ??
    matchLocale(source.navigator) ??
    defaultLocale
  );
}

export function matchLocale(literal?: string): Locale {
  const unexpectedLocale =
    literal == undefined ||
    (!literal.startsWith("zh") && !literal.startsWith("en"));
  if (unexpectedLocale) return defaultLocale;
  return literal as Locale;
}
