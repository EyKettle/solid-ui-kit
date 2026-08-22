# 已知问题

[English](/docs/known-issues.md) | 中文

## 职责

本文档记录参与本项目时会遇到、且可能导致误判的可观察现象——那些看起来像配置出错、实际并非如此的警告、报错或意外文件。每个条目都会说明是否需要处理，因为其中多数的正确处理方式是「无需处理」。

本文档不记录的内容：

- 安装与使用说明，这些属于 README。
- 项目内部的验证判据与评审检查项。
- 使用同类工具链的项目共有的上游行为，且不存在本项目特有的触发条件。
- 尚未产生任何可观察现象的未验证区域。

## TypeScript 的 peer 依赖警告

**现象** —— `pnpm install` 结束时出现 peer 依赖警告：

```text
[WARN] Issues with peer dependencies found. Run "pnpm peers check" to list them.
```

`pnpm peers check` 会列出未满足的 peer：

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

**原因** —— `eslint-plugin-solid` 依赖 `@typescript-eslint/*@8.67.0`，后者声明的 peer 范围止于 TypeScript 6.1 之前，而本项目钉在 TypeScript 7.0.2。

**影响** —— 未观察到影响。`pnpm run lint` 可正常运行并报出真实问题，说明该版本下 oxlint 的 JS-plugin 链路工作正常。

**处理** —— 无需处理。上游放宽 peer 范围后该警告自行消失。

## 非 Solid 工具链下的 ERR_PACKAGE_PATH_NOT_EXPORTED

**现象** —— 从原生 Node、或任何未启用 `@solidjs/vite-plugin` 的构建器解析本包都会失败。入口与子路径的报错措辞不同：

```text
code = ERR_PACKAGE_PATH_NOT_EXPORTED
message = No "exports" main defined in .../node_modules/eykt-ui/package.json
```

```text
code = ERR_PACKAGE_PATH_NOT_EXPORTED
message = Package subpath './button' is not defined by "exports" in .../node_modules/eykt-ui/package.json
```

**原因** —— `exports` 只声明了 `solid` 与 `types` 两个条件，刻意不写 `default`。Node 两者都不认识，因此所有路径都解析不到任何目标——包括确实被 `./*` 通配符匹配上的路径。

**影响** —— 属设计意图。本包分发的是未编译的 `.tsx` 源码，只有 Solid 编译链能消费它。该报错让误用直接暴露，而不是让消费方加载一份自己无法转换的源码。

**处理** —— 在消费方启用 `@solidjs/vite-plugin`。不要为消除报错而补上 `default` 条件：那是用一个清晰的失败换取构建链更深处的一个费解失败。

## 源码树旁出现残留的 .d.ts

**现象** —— `pnpm run check` 报 `TS6059` 时，报错所指目录旁会同时出现一个 `.d.ts` 文件：

```text
src/probe.ts(1,23): error TS6059: File '.../preview/probe.ts' is not under
  'rootDir' '.../src'. 'rootDir' is expected to contain all source files.
```

**原因** —— `tsconfig.lib.json` 用 `emitDeclarationOnly` 充当边界闸门。位于 `rootDir` 内的文件，其声明文件被映射进 `outDir`；而越界文件没有这层映射，声明文件便落在了源码旁边。

**影响** —— 该残留文件不会进入版本控制，`.gitignore` 已覆盖 `*.d.ts`。但它会留在工作目录中直到被删除。

**处理** —— 修掉越界 import，然后删除残留的 `.d.ts`。它的出现本身就是「库代码伸到了 `src/` 之外」的信号。

## solid(no-destructure) 命中列表回调

**现象** —— `pnpm run lint` 对一个解构参数报错，而该参数是数组元素、并非组件 props：

```text
preview/src/App.tsx:24:20: error solid(no-destructure): Destructuring component
  props breaks Solid's reactivity; use property access instead.
```

**原因** —— 该规则把任何返回 JSX 的箭头函数都视为组件，因此 `.map()` 回调中被解构的参数与被解构的 props 无法区分。

**影响** —— 以 `error` 级别报出，lint 会以非零码退出并阻断检查。

**处理** —— 改用属性访问（`item.name`、`<item.Component />`）而非解构回调参数。无论其背后的数据是否具备响应性，这都符合 Solid 的惯例。
