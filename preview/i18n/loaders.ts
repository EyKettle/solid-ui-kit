import type { Dictionary, Locale, Namespace } from "./types";

const modules = import.meta.glob<{ default: Dictionary }>("./dict/*/*.ts");

export async function loadNamespaces(
  locale: Locale,
  namespaces: readonly Namespace[],
): Promise<Dictionary> {
  const mods = await Promise.all(
    namespaces.map((ns) => loadNamespace(locale, ns)),
  );
  return Object.assign({}, ...mods);
}

export async function loadNamespace(
  locale: Locale,
  ns: Namespace,
): Promise<Dictionary> {
  const loader = modules[`./dict/${locale}/${ns}.ts`];
  if (!loader) {
    return Promise.reject(
      new Error(`no dictionary module for ${locale}/${ns}`),
    );
  }
  const m = await loader();
  return m.default;
}
