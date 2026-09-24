import { locales, namespaces } from "./config";

export type Locale = (typeof locales)[number];
export type Namespace = (typeof namespaces)[number];
type EnShape = (typeof import("./dict/en-US/common"))["default"];
export type Dictionary = {
  [K in keyof EnShape]: EnShape[K] extends (...a: infer A) => unknown
    ? (...a: A) => string
    : string;
};
export type Keys = keyof EnShape;
