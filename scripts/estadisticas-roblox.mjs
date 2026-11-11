// Recoge las estadísticas públicas de Gem Rush Clicker en Roblox y las añade al histórico.
// Lo ejecuta cada hora la GitHub Action .github/workflows/estadisticas.yml.
// Uso: node scripts/estadisticas-roblox.mjs <ruta del JSON>
//
// El JSON guarda los datos del juego (último valor) y una lista de muestras compactas:
//   muestras: [[segundos unix, jugando, visitas, favoritos, me gusta, no me gusta], ...]
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const PLACE_ID = 86556561042617;
const archivo = process.argv[2] ?? 'gem-rush.json';

async function api(url) {
  for (let intento = 1; ; intento++) {
    const res = await fetch(url, { headers: { accept: 'application/json' } });
    if (res.ok) return res.json();
    if (intento >= 3) throw new Error(`${res.status} en ${url}`);
    await new Promise((r) => setTimeout(r, 2000 * intento));
  }
}

const { universeId } = await api(`https://apis.roblox.com/universes/v1/places/${PLACE_ID}/universe`);

const [juegos, votos, favoritos, iconos, pases] = await Promise.all([
  api(`https://games.roblox.com/v1/games?universeIds=${universeId}`),
  api(`https://games.roblox.com/v1/games/votes?universeIds=${universeId}`),
  api(`https://games.roblox.com/v1/games/${universeId}/favorites/count`),
  api(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=256x256&format=Png`),
  api(`https://apis.roblox.com/game-passes/v1/universes/${universeId}/game-passes?passView=Full&pageSize=50`),
]);

const juego = juegos.data[0];
const voto = votos.data[0] ?? { upVotes: 0, downVotes: 0 };
const listaPases = (pases.gamePasses ?? []).filter((p) => p.isForSale);

// Iconos de los pases (las URL de la CDN de Roblox caducan, por eso se renuevan en cada ejecución)
let iconosPases = {};
if (listaPases.length) {
  const ids = listaPases.map((p) => p.id).join(',');
  const res = await api(`https://thumbnails.roblox.com/v1/game-passes?gamePassIds=${ids}&size=150x150&format=Png`);
  iconosPases = Object.fromEntries(res.data.map((t) => [t.targetId, t.imageUrl]));
}

const datos = existsSync(archivo) ? JSON.parse(readFileSync(archivo, 'utf8')) : { muestras: [] };
const ahora = Math.floor(Date.now() / 1000);

datos.juego = {
  nombre: juego.name,
  placeId: PLACE_ID,
  universeId,
  url: `https://www.roblox.com/games/${PLACE_ID}`,
  icono: iconos.data[0]?.imageUrl ?? null,
  creado: juego.created,
  actualizado: juego.updated,
  maxJugadores: juego.maxPlayers,
  pases: listaPases
    .map((p) => ({ nombre: p.displayName ?? p.name, precio: p.price, icono: iconosPases[p.id] ?? null }))
    .sort((a, b) => a.precio - b.precio),
};
datos.actualizado = new Date(ahora * 1000).toISOString();
datos.muestras.push([ahora, juego.playing, juego.visits, favoritos.favoritesCount, voto.upVotes, voto.downVotes]);

writeFileSync(archivo, JSON.stringify(datos) + '\n');
console.log(
  `${juego.name}: ${juego.playing} jugando, ${juego.visits} visitas, ${favoritos.favoritesCount} favoritos ` +
    `(${datos.muestras.length} muestras)`
);
