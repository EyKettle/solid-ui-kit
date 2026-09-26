import { Accessor, createEffect, createMemo, createSignal } from "solid-js";
import { DictCache, Dictionary, Locale, Namespace } from "./types";
import {
  resolveTemplate,
  Translator,
  translator,
} from "@solid-primitives/i18n";
import { getRequestEvent, isServer, serializeCookie } from "@solidjs/web";
import { cacheDictPages, dictForLocale, dictPageForPath } from "./dict";
import { matchLocale } from "./locale";
import { defaultLocale } from "./config";

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

export const dictCache: DictCache = new Map();
const dictPage = isServer
  ? () => dictPageForPath(pathname())
  : createMemo<Namespace>(() => dictPageForPath(pathname()));
const dict = isServer
  ? () => dictForLocale(locale(), dictCache)
  : createMemo<Dictionary>(() => {
      const l = locale();
      const page = dictPage();

      const needed = page == "common" ? [page] : (["common", page] as const);
      const missing = needed.filter((ns) => !dictCache.has(`${l}:${ns}`));

      if (missing.length === 0) return dictForLocale(l, dictCache);
      return cacheDictPages(l, missing, dictCache);
    });

export const { t } = createTranslator(locale, dict);

function pathname(): string {
  if (isServer) return new URL(getRequestEvent()!.request.url).pathname;
  return location.pathname;
}

function createTranslator<D extends Record<string, unknown>>(
  locale: Accessor<Locale>,
  dict: Accessor<D>,
): {
  t: Translator<D, string>;
} {
  if (!isServer)
    createEffect(
      () => locale(),
      (l) => {
        document.cookie = serializeCookie("language", l, {
          maxAge: 31536000,
          sameSite: "Lax",
        });
      },
    );

  const t = translator(dict, resolveTemplate);

  return { t };
}
