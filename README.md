# Adiya — Personal Portfolio

Хувийн portfolio сайт: bento grid, cursor spotlight, count-up болон scroll reveal анимацитай. Vite-аар build хийж, Firebase Hosting дээр байршдаг.

**Live:** https://athena-fullstack-adiya-d2f8e.web.app

## Технологи

- [Vite](https://vite.dev) — build tool
- Vanilla JS + CSS (framework ашиглаагүй)
- Firebase Hosting

## Бүтэц

```
index.html          Нүүр хуудас (Vite-ийн үндсэн entry)
case-studies/       Case-study хуудсууд — Vite-ийн нэмэлт entry-ууд
  autohub.html
  vega.html
  taria-mal.html
src/
  main.js           Spotlight, count-up, scroll reveal анимаци + сайтын үндсэн логик
  weather.js        Цаг агаарын widget
  cv.js             CV modal
  css/style.css     Модулиудыг @import хийдэг stylesheet-ийн entry
    base/ layout/ components/
public/             Build-д хөндөгдөхгүй, dist/-рүү шууд хуулагддаг
  assets/           Icon, зураг, logo
  favicon.svg  robots.txt
dist/               Build-ийн үр дүн (git-д ордоггүй, Firebase үүнийг deploy хийдэг)
```

CSS-ийг `public/`-д биш `src/`-д байрлуулсан учир нь Vite `@import` гинжийг
build үед **нэг minify хийсэн, hash-тай файл** болгон нийлүүлдэг. Case-study
хуудсууд мөн entry болсон тул тэд ч энэ bundle-ийг хуваалцдаг.

## Ажиллуулах

```bash
npm ci        # хамаарал суулгах (npm install БИШ — lockfile хамгаалахын тулд)
npm run dev   # http://localhost:5176 (5173-5175 нь бусад төслүүдэд эзэмшигдсэн)
```

## Deploy

```bash
npm run deploy:preview   # түр channel дээр гаргаж шалгах
npm run deploy           # live хаяг руу гаргах
```

Хоёулаа эхлээд `vite build` ажиллуулж `dist/`-г шинэчилдэг тул гараар файл хуулах шаардлагагүй.

Firebase project: `athena-fullstack-adiya` · Hosting site: `athena-fullstack-adiya-d2f8e`
