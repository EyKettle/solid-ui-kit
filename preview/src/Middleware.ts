import { getRequestEvent } from "@solidjs/web";
import { handleI18nRequest, I18nLocals } from "#i18n";

export default [
  async (_request: Request, next: () => Promise<Response>) => {
    const event = getRequestEvent()!;
    await handleI18nRequest(event);
    return next();
  },
];

declare module "@solidjs/web" {
  interface RequestEventLocals extends I18nLocals {}
}
