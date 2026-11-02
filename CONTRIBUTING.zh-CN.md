# 贡献约定

本文件只规定提交消息、代码规范与代码排版的约束。
开发环境、分支、评审与发布流程由维护者自行决定；这些流程不属于本文件。

## 提交消息

提交消息使用英文，并遵循 [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)。

在 Conventional Commits 之外，正文使用语义换行：主题保持单行；正文在句子、分句或列表项的边界断行，不在短语内部折断，也不按固定列宽硬换行。
保证每行内容均在一口气内读完。

## 代码规范

代码规范由 `eslint-plugin-solid` 的 v2 规则约束。
规则集以 [`oxlint.config.mjs`](./oxlint.config.mjs) 为准，提交必须通过 `just lint`。

## 代码排版

代码排版由 [`.oxfmtrc.json`](./.oxfmtrc.json) 约束。
提交必须通过 `oxfmt --check`。
