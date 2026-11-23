import { initCVModal } from "./cv.js";

initCVModal();

/* Хэсгүүд дэлгэцэнд орохдоо зөөлөн гарч ирнэ (data-reveal).
   «Хөдөлгөөн багасгах» тохиргоотой эсвэл JS ажиллахгүй үед бүх зүйл шууд харагдана. */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.addEventListener(
          "animationend",
          () => entry.target.classList.remove("reveal", "is-visible"),
          { once: true }
        );
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    // Нэг мөрөнд зэрэгцсэн картууд бага зэрэг дараалж гарна
    const i = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.animationDelay = `${Math.min(i * 70, 210)}ms`;
    el.classList.add("reveal");
    observer.observe(el);
  });
}
