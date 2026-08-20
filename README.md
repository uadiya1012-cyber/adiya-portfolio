# Adiya — Personal Portfolio

Three.js суурьтай 3D дэвсгэртэй хувийн portfolio сайт. Vite-аар build хийж, Firebase Hosting дээр байршдаг.

**Live:** https://athena-fullstack-adiya-d2f8e.web.app

## Технологи

- [Vite](https://vite.dev) — build tool
- [Three.js](https://threejs.org) — hero хэсгийн 3D дэвсгэр
- Vanilla JS + CSS (framework ашиглаагүй)
- Firebase Hosting

## Бүтэц

```
index.html          Сайтын бүх бүтэц (Vite-ийн entry)
src/
  main.js           Three.js scene + сайтын үндсэн логик
  weather.js        Цаг агаарын widget
  cv.js             CV modal
  style.css         main.js-ээс import хийгддэг (bundle-д ордог)
public/             Build-д хөндөгдөхгүй, dist/-рүү шууд хуулагддаг
  css/              Модуль болгон хуваасан stylesheet-үүд
  js/3d-tilt.js     Картын tilt эффект
  assets/           Icon, зураг, logo
dist/               Build-ийн үр дүн (git-д ордоггүй, Firebase үүнийг deploy хийдэг)
```

## Ажиллуулах

```bash
npm ci        # хамаарал суулгах (npm install БИШ — lockfile хамгаалахын тулд)
npm run dev   # http://localhost:5173
```

## Deploy

```bash
npm run deploy:preview   # түр channel дээр гаргаж шалгах
npm run deploy           # live хаяг руу гаргах
```

Хоёулаа эхлээд `vite build` ажиллуулж `dist/`-г шинэчилдэг тул гараар файл хуулах шаардлагагүй.

Firebase project: `athena-fullstack-adiya` · Hosting site: `athena-fullstack-adiya-d2f8e`
