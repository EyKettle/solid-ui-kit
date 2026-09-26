import { DictionaryOf, Namespace } from "../types";
import { dictPageMap } from "../config";

type _noDuplicateKeys = AssertNever<DictCollisions>;
type _noDuplicateRoute = AssertNever<RouteCollisions>;

type DictKeys<K extends Namespace> = keyof DictionaryOf<K> & string;
type DictCollisions = {
  [A in Namespace]: {
    [B in Exclude<Namespace, A>]: DictKeys<A> & DictKeys<B> extends never
      ? never
      : { namespaces: [A, B]; key: DictKeys<A> & DictKeys<B> };
  }[Exclude<Namespace, A>];
}[Namespace];

type Routes<K extends Namespace> = (typeof dictPageMap)[K];
type RouteCollisions = {
  [A in Namespace]: {
    [B in Exclude<Namespace, A>]: Routes<A> & Routes<B> extends never
      ? never
      : { namespaces: [A, B]; route: Routes<A> & Routes<B> };
  }[Exclude<Namespace, A>];
}[Namespace];

type AssertNever<T extends never> = T;
