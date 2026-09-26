import type { DictionaryOf } from "../../types";

export default {
  "nav.home": "主页",
  "nav.about": "关于",
  "demo.empty": "还没示例内容",
  "lang.switch": "切换语言",
} as const satisfies DictionaryOf<"common">;
