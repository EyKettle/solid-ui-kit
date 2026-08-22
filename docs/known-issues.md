# Known Issues

English | [中文](/docs_zh-CN/known-issues.md)

## Scope

This document records observable symptoms that can mislead someone working on this project — a warning, an error, or an unexpected file that looks like a misconfiguration but is not. Every entry states whether action is required, because for most of them the correct action is none.

What this document does not record:

- Setup and usage instructions. Those belong in the README.
- The project's internal verification criteria and review checks.
- Upstream behaviour shared by every project using the same tooling, with no project-specific trigger.
- Unverified areas that produce no observable symptom yet.

## Peer dependency warning for TypeScript

**Symptom** — `pnpm install` ends with a peer dependency warning:

```text
[WARN] Issues with peer dependencies found. Run "pnpm peers check" to list them.
```

`pnpm peers check` then reports an unmet peer:

```text
✕ unmet peer typescript
  Installed: 7.0.2
  Wanted:
    ">=4.8.4 <6.1.0":
      @typescript-eslint/utils@8.67.0
      @typescript-eslint/typescript-estree@8.67.0
      @typescript-eslint/project-service@8.67.0
      @typescript-eslint/tsconfig-utils@8.67.0
```

**Cause** — `eslint-plugin-solid` depends on `@typescript-eslint/*@8.67.0`, whose declared peer range stops before TypeScript 6.1. This project pins TypeScript 7.0.2.

**Impact** — None observed. `pnpm run lint` runs and reports genuine findings, so the oxlint JS-plugin path is functional under this version.

**Action** — None required. The warning clears itself once the upstream peer range widens.

## ERR_PACKAGE_PATH_NOT_EXPORTED outside a Solid toolchain

**Symptom** — resolving the package from plain Node, or from any builder without `@solidjs/vite-plugin`, fails. The entry point and the subpaths produce different wording:

```text
code = ERR_PACKAGE_PATH_NOT_EXPORTED
message = No "exports" main defined in .../node_modules/eykt-ui/package.json
```

```text
code = ERR_PACKAGE_PATH_NOT_EXPORTED
message = Package subpath './button' is not defined by "exports" in .../node_modules/eykt-ui/package.json
```

**Cause** — `exports` declares only the `solid` and `types` conditions and deliberately omits `default`. Node recognises neither, so every path resolves to nothing — including a path that the `./*` wildcard does match.

**Impact** — Intended. This package ships uncompiled `.tsx` sources, and only a Solid compilation chain can consume them. The error surfaces the misuse instead of letting a consumer load source it cannot transform.

**Action** — Enable `@solidjs/vite-plugin` in the consuming project. Do not add a `default` condition to silence the error: that trades a clear failure for a confusing one further down the build.

## Stray .d.ts appears next to the source tree

**Symptom** — when `pnpm run check` reports `TS6059`, a `.d.ts` file also appears beside the directory named in the error:

```text
src/probe.ts(1,23): error TS6059: File '.../preview/probe.ts' is not under
  'rootDir' '.../src'. 'rootDir' is expected to contain all source files.
```

**Cause** — `tsconfig.lib.json` uses `emitDeclarationOnly` as a boundary gate. A file inside `rootDir` has its declaration mapped into `outDir`; a file outside `rootDir` has no such mapping, so its declaration lands next to the source instead.

**Impact** — The stray file is ignored by git, since `.gitignore` covers `*.d.ts`. It stays in the working directory until removed.

**Action** — Fix the out-of-bounds import, then delete the leftover `.d.ts`. Its presence is itself the signal that library code reached outside `src/`.

## solid(no-destructure) fires on list callbacks

**Symptom** — `pnpm run lint` reports an error on a destructured parameter that is an array element rather than component props:

```text
preview/src/App.tsx:24:20: error solid(no-destructure): Destructuring component
  props breaks Solid's reactivity; use property access instead.
```

**Cause** — the rule treats any JSX-returning arrow function as a component, so a destructured `.map()` callback parameter is indistinguishable from destructured props.

**Impact** — Reported at `error` severity, so lint exits non-zero and blocks the check.

**Action** — Use property access (`item.name`, `<item.Component />`) instead of destructuring the callback parameter. This matches Solid's convention whether or not the data behind it is reactive.
