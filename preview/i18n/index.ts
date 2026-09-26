export { defaultLocale, locales, namespaces, dictPageMap } from "./config";
export { locale, setLocale, t } from "./context";
export type { Locale, Namespace, DictionaryOf, Dictionary } from "./types";

export { handleI18nRequest, type I18nLocals } from "./middleware";
