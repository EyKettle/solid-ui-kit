import { parseCookieHeader, RequestEvent } from "@solidjs/web";
import { pickLocale } from "./locale";
import { cacheDictPages, dictPageForPath } from "./dict";
import { dictCache } from "./context";
import { Locale } from "./types";

export async function handleI18nRequest(event: RequestEvent) {
  event.locals.locale = pickLocale({
    cookie: parseCookieHeader(event.request.headers.get("cookie"))["language"],
  });
  await cacheDictPages(
    event.locals.locale,
    [dictPageForPath(new URL(event.request.url).pathname)],
    dictCache,
  );
}

export interface I18nLocals {
  locale?: Locale;
}
