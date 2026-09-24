import { Accessor, createEffect } from "solid-js";
import { Dictionary, Locale } from "./types";
import {
  resolveTemplate,
  Translator,
  translator,
} from "@solid-primitives/i18n";
import { isServer, serializeCookie } from "@solidjs/web";

export function createTranslator(
  locale: Accessor<Locale>,
  dict: Accessor<Dictionary>,
): {
  t: Translator<Dictionary, string>;
} {
  createEffect(
    () => locale(),
    (l) => {
      if (isServer) return;
      document.cookie = serializeCookie("language", l, {
        maxAge: 31536000,
        sameSite: "Lax",
      });
    },
  );

  const t = translator(dict, resolveTemplate);

  return { t };
}
