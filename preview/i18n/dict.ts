import { dictPageMap, namespaces } from "./config";
import type { Locale, Namespace, Dictionary, DictCache } from "./types";

export async function cacheDictPages<const Ns extends readonly Namespace[]>(
  locale: Locale,
  names: Ns,
  cache: DictCache,
): Promise<Dictionary> {
  return Promise.all(names.map((ns) => loadDictPage(locale, ns))).then(
    (loaded) => {
      names.forEach((ns, i) => cache.set(`${locale}:${ns}`, loaded[i]!));
      return dictForLocale(locale, cache);
    },
  );
}

export async function loadDictPage<K extends Namespace>(
  locale: Locale,
  ns: K,
): Promise<Dictionary> {
  const loader = modules[`./dict/${locale}/${ns}.ts`];
  if (!loader) {
    return Promise.reject(
      new Error(`no dictionary module for ${locale}/${ns}`),
    );
  }
  const loaded = await loader();
  return loaded.default as Dictionary;
}

export function dictForLocale(locale: Locale, cache: DictCache): Dictionary {
  const flat: Record<string, unknown> = {};
  for (const ns of namespaces)
    Object.assign(flat, cache.get(`${locale}:${ns}`));
  return flat as Dictionary;
}

export function dictPageForPath(pathname: string): Namespace {
  for (const ns of namespaces) {
    if (dictPageMap[ns] === pathname) return ns;
  }
  return "common";
}

const modules = import.meta.glob<{ default: object }>("./dict/*/*.ts");
