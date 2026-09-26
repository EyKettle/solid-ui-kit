import { locales, namespaces } from "./config";

export type DictionaryOf<K extends Namespace> = Widen<BaseModules[K]>;
export type Dictionary = { [K in AllKeys]: ValueOf<K> };
export type DictCache = Map<`${Locale}:${Namespace}`, DictionaryOf<Namespace>>;

export type Locale = (typeof locales)[number];
export type Namespace = (typeof namespaces)[number];

type Widen<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => unknown
    ? (...args: A) => string
    : string;
};
type BaseModules = {
  common: typeof import("./dict/en-US/common").default;
  dashboard: typeof import("./dict/en-US/dashboard").default;
};

type AllKeys = {
  [N in Namespace]: keyof DictionaryOf<N> & string;
}[Namespace];

type ValueOf<K extends AllKeys> = {
  [N in Namespace]: K extends keyof DictionaryOf<N>
    ? DictionaryOf<N>[K]
    : never;
}[Namespace];
