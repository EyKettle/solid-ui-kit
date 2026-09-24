import type { ParentProps } from "solid-js";
import { HydrationScript } from "@solidjs/web";

// The document shell picked up by the src/Document.* convention: it renders the
// full <html> and is where head tags go. Compiled only into the prerendered
// static shell, it ships zero client-side JS.
export default function Document(props: ParentProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#eee" />
        <meta
          name="theme-color"
          content="#262626"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>eykt-ui preview</title>
        <HydrationScript />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
