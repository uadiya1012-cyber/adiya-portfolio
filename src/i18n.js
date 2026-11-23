/* Хоёр хэлтэй хуудас (англи / монгол).

   Хуудасны HTML нь өөрийн ҮНДСЭН хэлээр бичигдсэн (нүүр = en, /web/ = mn), нөгөө хэлний
   орчуулга нь src/i18n/*.js-д байна. Орчуулах элемент бүр data-i18n="түлхүүр" авна.
   Үндсэн хэл рүү буцахдаа анхны HTML-ийг сэргээдэг тул текстийг хоёр газар хадгалахгүй.

   Хэл сонгох дараалал: URL-ийн ?lang= → өмнө нь товч дарж сонгосон (localStorage) → хуудасны
   үндсэн хэл. Хөтчийн хэлийг санаатайгаар харахгүй: Монголд олон хүн англи хэлтэй хөтөч
   хэрэглэдэг тул /web/-ийн монгол санал англиар гарч ирэх эрсдэлтэй. */

const STORAGE_KEY = "lang";
const LANGS = ["en", "mn"];

function pickLang(base) {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (LANGS.includes(fromUrl)) return fromUrl;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    /* Хувийн горимд localStorage хаалттай байж болно — үндсэн хэлээр үлдэнэ */
  }
  return base;
}

/**
 * @param {object} opts
 * @param {"en"|"mn"} opts.base  HTML-д бичигдсэн хэл
 * @param {Record<string, string>} opts.strings  нөгөө хэлний орчуулга (түлхүүр → HTML).
 *        `_title` түлхүүр нь <title>-ийг орчуулна.
 */
export function initI18n({ base, strings }) {
  const alt = base === "en" ? "mn" : "en";
  const els = Array.from(document.querySelectorAll("[data-i18n]"));
  const original = new Map(els.map((el) => [el, el.innerHTML]));
  const originalTitle = document.title;
  const buttons = document.querySelectorAll("[data-lang-btn]");

  const apply = (lang) => {
    const useAlt = lang === alt;
    for (const el of els) {
      const key = el.dataset.i18n;
      el.innerHTML = useAlt && key in strings ? strings[key] : original.get(el);
    }
    document.title = useAlt && strings._title ? strings._title : originalTitle;
    document.documentElement.lang = lang;
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.langBtn === lang)));
  };

  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      const lang = b.dataset.langBtn;
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        /* хадгалж чадахгүй бол зөвхөн энэ хуудсанд сэлгэнэ */
      }
      // ?lang= үлдвэл дараагийн ачаалалд товчны сонголтыг дарж бичих тул арилгана
      const url = new URL(location.href);
      if (url.searchParams.has("lang")) {
        url.searchParams.delete("lang");
        history.replaceState(null, "", url);
      }
      apply(lang);
    })
  );

  apply(pickLang(base));
}
