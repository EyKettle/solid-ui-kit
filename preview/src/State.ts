import {
  createTranslator,
  defaultLocale,
  Dictionary,
  loadNamespace,
  Locale,
  matchLocale,
} from "#i18n";
import { getRequestEvent, isServer } from "@solidjs/web";
import { createMemo, createSignal } from "solid-js";

import bootCommon from "../i18n/dict/en-US/common";

function bootLocale(): Locale {
  if (isServer) return defaultLocale;
  return matchLocale(document.documentElement.lang) || defaultLocale;
}
const [clientLocale, setLocale] = createSignal<Locale>(bootLocale());

export function locale(): Locale {
  if (isServer) return getRequestEvent()?.locals.locale ?? defaultLocale;
  return clientLocale();
}
export { setLocale };

const cache = new Map<Locale, Dictionary>([[defaultLocale, bootCommon]]);
const clientDict = createMemo(() => {
  const l = locale();
  const hit = cache.get(l);
  if (hit) return hit;
  return loadNamespace(l, "common").then((d) => {
    cache.set(l, d);
    return d;
  });
});

function dict(): Dictionary {
  if (isServer) return getRequestEvent()!.locals.dict;
  return clientDict();
}

export const { t } = createTranslator(locale, dict);

declare module "@solidjs/web" {
  interface RequestEventLocals {
    locale?: Locale;
    dict: Dictionary;
  }
}
