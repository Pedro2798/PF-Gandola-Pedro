# PG Studio — pganstudio.com

Landing page de **PG Studio** (Pedro Gandola): soluciones con IA para negocios reales.

## Stack

- HTML + CSS + JavaScript vanilla, sin build step
- [GSAP 3](https://gsap.com/) + ScrollTrigger (auto-hospedado en `js/vendor/`)
- Fuentes auto-hospedadas (Poppins, Inter, Playfair Display) en `assets/fonts/`
- Video del hero generado con IA (4 escenas, 15 s) en `assets/hero-loop.{webm,mp4}`
- Modo claro/oscuro con `data-theme` + `localStorage`

## Desarrollo local

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploy

Sitio estático: cualquier hosting sirve. En **Vercel**: importar el repo, framework
"Other", sin comando de build, output directory `./`. El dominio `pganstudio.com`
se configura en Project → Settings → Domains.

## Pendientes

- Reemplazar `000000000000` por el número de WhatsApp real en `index.html` (buscar `TODO`)
- Reemplazar los proyectos de ejemplo por casos reales
