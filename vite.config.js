import { resolve } from "node:path";

export default {
  server: {
    // 5173 = POS, 5174 = AutoHub, 5175 = Тариа & Мал (local_port_map үзнэ үү).
    // strictPort: порт завгүй бол чимээгүйхэн өөр төслийн порт руу
    // шилжихийн оронд алдаа шидэж зогсоно.
    port: 5176,
    strictPort: true,
  },
  build: {
    // Олон хуудаст build: case-study хуудсууд public/-д статикаар суухын
    // оронд entry болсон. Ингэснээр тэдний CSS-ийг ч Vite bundle хийнэ.
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        autohub: resolve(import.meta.dirname, "case-studies/autohub.html"),
        vega: resolve(import.meta.dirname, "case-studies/vega.html"),
        tariaMal: resolve(import.meta.dirname, "case-studies/taria-mal.html"),
      },
    },
  },
};
