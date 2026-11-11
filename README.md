# quim21.github.io

Mi portafolio personal, hecho con [Astro](https://astro.build) y publicado en GitHub Pages.

🌐 **https://quim21.github.io**

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera la web en dist/
```

## Cómo actualizarlo

- **La nau PiaXXII jugable** (`/piaxxii/`): tras cambiar el juego, ejecuta `npm run sync:piaxxii` para copiar su código a `public/piaxxii/game`
- **Ajedrez jugable** (`/ajedrez/`): tras cambiar `QuimPerez_Escacs.py`, ejecuta `npm run sync:ajedrez`. El tablero (`src/pages/ajedrez.astro`) llama a las funciones del juego a través de `public/ajedrez/puente.py`
- **Panel de Gem Rush** (`/gem-rush/`): la Action `estadisticas.yml` ejecuta `scripts/estadisticas-roblox.mjs` cada hora y guarda el histórico en la rama `datos`. Para probarlo en local, pon un JSON de prueba en `public/_dev/gem-rush.json` (está en `.gitignore`)
- **Proyectos:** `src/data/projects.ts` (destacados en `featured`, el resto en `more`)
- **Datos personales, contacto y stack:** `src/data/profile.ts`
- **Capturas:** guárdalas en `src/assets/` e impórtalas en `projects.ts`

Cada `push` a `main` publica la web automáticamente con GitHub Actions (`.github/workflows/deploy.yml`).
