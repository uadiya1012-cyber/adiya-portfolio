import "./style.css";
import { initWeatherWidget } from "./weather.js";
import { initCVModal } from "./cv.js";

// Initialize UI components
initWeatherWidget();
initCVModal();

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ── Spotlight: cells glow where the cursor is ─────────────── */
document.querySelectorAll(".bento-cell").forEach((cell) => {
  cell.addEventListener("pointermove", (e) => {
    const rect = cell.getBoundingClientRect();
    cell.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    cell.style.setProperty("--my", `${e.clientY - rect.top}px`);
  });
});

/* ── Count-up stats when they scroll into view ─────────────── */
const counters = document.querySelectorAll("[data-count]");

if (!reduceMotion && "IntersectionObserver" in window && counters.length) {
  const animateCount = (el) => {
    const end = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(end * eased).toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => counterObserver.observe(el));
}

/* ── Scroll-reveal: bento cells rise in softly ─────────────── */
const revealTargets = document.querySelectorAll(
  ".reveal-block, .hero-bento > *, .skills-bento > *, .about-bento > *, .work-bento > *, .contact-bento > *"
);

if (!reduceMotion && "IntersectionObserver" in window) {
  // Stagger cells inside each grid
  document
    .querySelectorAll(".hero-bento, .skills-bento, .about-bento, .work-bento, .contact-bento")
    .forEach((grid) => {
      Array.from(grid.children).forEach((child, i) => {
        child.style.animationDelay = `${Math.min(i * 60, 360)}ms`;
      });
    });

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

  revealTargets.forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
  });
}

/* ── Floating avatar — glides between lanes, parks in its seat ── */
const avatar = document.querySelector(".floating-avatar");

if (avatar && !reduceMotion && window.matchMedia("(min-width: 900px)").matches) {
  // `park` targets a real element's center; otherwise xf is a viewport fraction
  const stops = [
    { sel: "#home", xf: 0.79, yBias: 0.42 }, // hero — beside the intro card
    { sel: "#services", xf: 0.16, yBias: 0.4 }, // header pushed right → left lane free
    { sel: "#avatar-seat", park: true }, // its reserved seat in About 🪑
    { sel: "#projects", xf: 0.85, yBias: 0.38 }, // header on left → right lane free
    { sel: "#contact", xf: 0.5, yBias: 0.3 }, // finale behind the CTA glass
  ]
    .map((s) => ({ ...s, el: document.querySelector(s.sel) }))
    .filter((s) => s.el);

  const easeInOut = (t) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  let anchors = []; // doc-space Y for each stop

  const measure = () => {
    const sy = window.scrollY;
    anchors = stops.map((s) => {
      const top = s.el.getBoundingClientRect().top + sy;
      return top + window.innerHeight * (s.yBias ?? 0.4);
    });
  };

  let targetX = 0;
  let targetY = 0;
  let curX = null;
  let curY = null;
  let lean = 0; // tilts into travel direction for a lifelike walk
  let rafId = null;

  const computeTarget = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const sy = window.scrollY;

    let x, yDoc;
    if (sy <= anchors[0]) {
      x = stops[0].xf * vw;
      yDoc = anchors[0];
    } else if (sy >= anchors[anchors.length - 1]) {
      const last = stops.length - 1;
      x = stops[last].xf * vw;
      yDoc = anchors[last];
    } else {
      let i = 0;
      while (i < anchors.length - 2 && sy >= anchors[i + 1]) i++;
      const t = easeInOut(
        Math.min(Math.max((sy - anchors[i]) / (anchors[i + 1] - anchors[i]), 0), 1)
      );
      x =
        (stops[i].xf + (stops[i + 1].xf - stops[i].xf) * t) * vw;
      yDoc = anchors[i] + (anchors[i + 1] - anchors[i]) * t;
    }

    // Parked stops snap to their element's actual center
    const activeIdx =
      sy <= anchors[0]
        ? 0
        : sy >= anchors[anchors.length - 1]
          ? stops.length - 1
          : (() => {
              let i = 0;
              while (i < anchors.length - 2 && sy >= anchors[i + 1]) i++;
              return i;
            })();

    if (stops[activeIdx]?.park) {
      const rect = stops[activeIdx].el.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      targetX = x;
      targetY = Math.max(rect.top + rect.height / 2 - avatar.offsetHeight / 2, 90);
      return;
    }

    // Convert to screen space and keep it comfortably inside the viewport
    targetX = x - avatar.offsetWidth / 2;
    targetY = Math.min(
      Math.max(yDoc - sy, 90),
      vh - avatar.offsetHeight - 70
    );
  };

  const step = () => {
    const prevX = curX;
    curX += (targetX - curX) * 0.06;
    curY += (targetY - curY) * 0.06;

    // Lean proportional to horizontal motion, settling back to upright
    const leanTarget = Math.max(Math.min((curX - prevX) * 2.4, 7), -7);
    lean += (leanTarget - lean) * 0.08;

    avatar.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) rotate(${lean.toFixed(2)}deg)`;

    if (
      Math.abs(targetX - curX) > 0.4 ||
      Math.abs(targetY - curY) > 0.4 ||
      Math.abs(lean) > 0.05
    ) {
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
    }
  };

  const wake = () => {
    if (rafId === null) rafId = requestAnimationFrame(step);
  };

  const refresh = () => {
    measure();
    computeTarget();
    wake();
  };

  // First placement — snap into position, then fade in
  measure();
  computeTarget();
  curX = targetX;
  curY = targetY;
  avatar.style.transform = `translate3d(${curX.toFixed(1)}px, ${curY.toFixed(1)}px, 0) rotate(0deg)`;
  requestAnimationFrame(() => avatar.classList.add("is-ready"));

  window.addEventListener(
    "scroll",
    () => {
      measure();
      computeTarget();
      wake();
    },
    { passive: true }
  );
  window.addEventListener("resize", refresh);
  window.addEventListener("load", refresh);
}
