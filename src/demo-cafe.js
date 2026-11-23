/* Жишээ сайт «Аяга & Боов» (/demo/cafe/).
   1) Одоо нээлттэй эсэх — Улаанбаатарын цагаар, цагийн хуваарийн хүснэгттэй ижил өгөгдлөөс.
   2) Жишээ товчнууд — кафе зохиомол тул залгах/Messenger товч хаашаа ч явахгүй,
      оронд нь «жинхэнэ сайтад юу болох вэ»-г тайлбарлана. */
import "./css/demo-cafe.css";

// Цагийн хуваарь (минутаар). HTML-ийн .hours хүснэгттэй таарах ёстой.
const HOURS = {
  weekday: { open: 8 * 60, close: 21 * 60 },
  weekend: { open: 9 * 60, close: 22 * 60 },
};
const groupOf = (day) => (day === 0 || day === 6 ? "weekend" : "weekday"); // 0 = Ням

const fmt = (min) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/** Зочны цагийн бүсээс үл хамааран Улаанбаатарын одоогийн гараг ба минут. */
function nowInUlaanbaatar() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ulaanbaatar",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, min: Number(get("hour")) * 60 + Number(get("minute")) };
}

function openStatus({ day, min }) {
  const today = HOURS[groupOf(day)];
  if (min >= today.open && min < today.close) {
    return { open: true, text: `Одоо нээлттэй · ${fmt(today.close)} хүртэл` };
  }
  if (min < today.open) {
    return { open: false, text: `Одоо хаалттай · ${fmt(today.open)} цагт нээгдэнэ` };
  }
  const tomorrow = HOURS[groupOf((day + 1) % 7)];
  return { open: false, text: `Одоо хаалттай · маргааш ${fmt(tomorrow.open)} цагт нээгдэнэ` };
}

function renderStatus() {
  const now = nowInUlaanbaatar();
  const { open, text } = openStatus(now);
  const el = document.querySelector("[data-open-status]");
  if (el) {
    el.classList.toggle("is-open", open);
    el.querySelector(".status__text").textContent = text;
  }
  document
    .querySelectorAll(".hours tr[data-days]")
    .forEach((tr) => tr.classList.toggle("is-today", tr.dataset.days === groupOf(now.day)));
}

renderStatus();
setInterval(renderStatus, 60_000);

// --- Жишээ товчнууд ---
const DEMO_MSG = {
  call: "Жишээ сайт: жинхэнэ сайтад энэ товчийг дарахад танай утас руу шууд залгана.",
  messenger: "Жишээ сайт: жинхэнэ сайтад танай Facebook хуудасны Messenger чат нээгдэнэ.",
  map: "Жишээ сайт: жинхэнэ сайтад Google Maps дээр танай байршил нээгдэнэ.",
  social: "Жишээ сайт: жинхэнэ сайтад танай Facebook, Instagram хуудас нээгдэнэ.",
};

const toast = document.querySelector(".toast");
let hideTimer;

document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-demo]");
  if (!btn || !toast) return;
  e.preventDefault();
  toast.textContent = DEMO_MSG[btn.dataset.demo];
  toast.hidden = false;
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => (toast.hidden = true), 4500);
});
