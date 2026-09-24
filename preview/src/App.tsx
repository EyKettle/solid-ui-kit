import type { Component } from "solid-js";
import "./App.css";
import { setLocale, t } from "./State";

// Demos are discovered from the filesystem, so the component list never has to
// be maintained a second time. Every demo default-exports a component.
const modules = import.meta.glob<{ default: Component }>("../demos/**/*.tsx", {
  eager: true,
});

const demos = Object.entries(modules)
  .map(([path, module]) => ({
    name: path.replace("../demos/", "").replace(/\.tsx$/, ""),
    Demo: module.default,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export default function App() {
  const handleLanguageSwitch = () => {
    setLocale((old) => (old === "en-US" ? "zh-CN" : "en-US"));
  };

  return (
    <main class="preview">
      <h1>eykt-ui preview</h1>
      <button onClick={handleLanguageSwitch}>{t("lang.switch")}</button>
      {demos.length === 0 ? (
        <p class="empty">{t("demo.empty")}</p>
      ) : (
        demos.map((demo) => (
          <section class="demo">
            <h2>{demo.name}</h2>
            <demo.Demo />
          </section>
        ))
      )}
    </main>
  );
}
