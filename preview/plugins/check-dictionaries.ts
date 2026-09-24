// Vite plugin: verify that the dict/ directory and the i18n config lists are
// an exact mirror of each other. Runs on dev-server start and on every build
// via the buildStart hook; produces zero client-side code.
//
// This gate exists because import.meta.glob types its keys as plain string:
// a missing dictionary file cannot fail compilation, so it must fail here,
// before a user ever sees a broken language switch.

import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { locales, namespaces } from "../i18n/config";

export default function checkDictionaries(options?: {
  dictDir?: string;
}): Plugin {
  let dir = "";

  return {
    name: "check-dictionaries",

    configResolved(resolved) {
      // Anchor at the vite root, not import.meta.url: vite's config loader
      // bundles this plugin into the config bundle and defines
      // import.meta.url once for the whole bundle — to the config file's
      // own URL. Relative-to-module resolution is therefore impossible in
      // config-bundled code; resolved.root is the reliable anchor.
      dir = options?.dictDir ?? resolve(resolved.root, "i18n/dict");
    },

    buildStart() {
      if (!existsSync(dir)) {
        this.error(`i18n dictionary directory is missing: ${dir}`);
      }

      // Directory side: what actually exists, as "<locale>/<namespace>"
      const found = new Set<string>();
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        for (const file of readdirSync(resolve(dir, entry.name))) {
          if (file.endsWith(".ts")) {
            found.add(`${entry.name}/${file.slice(0, -".ts".length)}`);
          }
        }
      }

      // Config side: what the app declares loadable
      const declared = new Set<string>();
      for (const locale of locales) {
        for (const ns of namespaces) {
          declared.add(`${locale}/${ns}`);
        }
      }

      // Exact mirror in both directions. A declared-but-missing module
      // would reject at runtime; an undeclared module is a dead file —
      // a dictionary's only purpose is to be loaded.
      const problems: string[] = [];
      for (const key of declared) {
        if (!found.has(key)) {
          problems.push(`config declares ${key}, but no such module exists`);
        }
      }
      for (const key of found) {
        if (!declared.has(key)) {
          problems.push(`dict/${key} exists but is not declared in config`);
        }
      }

      if (problems.length > 0) {
        this.error(
          [
            "dict/ directory and i18n config disagree:",
            ...problems.map((p) => `  - ${p}`),
          ].join("\n"),
        );
      }
    },
  };
}
