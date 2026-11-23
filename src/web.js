/* /web/ хуудас (үндсэн хэл = монгол) — EN/МН сэлгүүр. */
import { initI18n } from "./i18n.js";
import en from "./i18n/web.en.js";

initI18n({ base: "mn", strings: en });
