import { getRequestEvent, parseCookieHeader } from "@solidjs/web";
import { loadNamespaces, pickLocale } from "#i18n";
import { bootNamespaces } from "../i18n/config";

export default [
  async (request: Request, next: () => Promise<Response>) => {
    const event = getRequestEvent()!;
    event.locals.locale = pickLocale({
      cookie: parseCookieHeader(request.headers.get("cookie"))["language"],
    });
    event.locals.dict = await loadNamespaces(event.locals.locale, bootNamespaces);
    return next();
  },
];
