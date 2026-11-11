// Para añadir un proyecto, añade una entrada a `featured` o a `more`.
// `visual` decide qué se dibuja en la cabecera de la tarjeta:
//   image    → una captura (importada desde src/assets)
//   tree     → un árbol de carpetas (`lines`)
//   terminal → una salida de terminal (`lines`)
import gemRush from '../assets/gem-rush.png';
import type { ImageMetadata } from 'astro';

type Visual =
  | { type: 'image'; src: ImageMetadata; alt: string }
  | { type: 'tree' | 'terminal'; title: string; lines: string[] };

export interface FeaturedProject {
  title: string;
  kind: string;
  summary: string;
  highlights: string[];
  stack: string[];
  repo?: string; // si no hay repo público, se muestra "Código privado"
  demo?: string;
  demoLabel?: string; // texto del botón de la demo (por defecto "Demo")
  extra?: { href: string; label: string }[]; // enlaces internos adicionales
  credits?: string;
  visual: Visual;
}

export interface Project {
  title: string;
  kind: string;
  summary: string;
  stack: string[];
  repo: string;
  demo?: string;
  demoLabel?: string;
}

export const featured: FeaturedProject[] = [
  {
    title: 'Gem Rush Clicker',
    kind: 'Juego multijugador · Roblox',
    summary:
      'Juego clicker con progresión por mundos, árbol de habilidades, mascotas, comercio entre jugadores y guardado por jugador. Cada jugador tiene su propia partida aunque comparta servidor con otros.',
    highlights: [
      'Unas 9.000 líneas de Luau separadas en cliente, servidor y configuración compartida',
      'Más de 20 servicios de servidor: mascotas, comercio, prestigio, rebirth, recompensas diarias y ranking',
      'Guardado persistente en DataStore y validación en el servidor contra exploits',
      'Publicado en Roblox con 5 game passes a la venta y un panel de estadísticas propio',
    ],
    stack: ['Luau', 'Roblox', 'Rojo', 'DataStore'],
    demo: 'https://www.roblox.com/games/86556561042617/Gem-Rush-Clicker',
    demoLabel: 'Jugar en Roblox',
    extra: [{ href: '/gem-rush/', label: 'Estadísticas' }],
    visual: { type: 'image', src: gemRush, alt: 'Miniatura de Gem Rush Clicker: una gema azul con el texto Click gems, Upgrade, Unlock 5 worlds' },
  },
  {
    title: 'Mythical Beast Tycoon',
    kind: 'Juego tycoon · Roblox',
    summary:
      'Tycoon de criaturas mitológicas: el jugador rescata, incuba y cría bestias en su propio santuario para generar Esencia Divina y ampliarlo.',
    highlights: [
      'Arquitectura por servicios (servidor) y controladores (cliente) con tipos y configuración compartidos',
      'Servidor autoritativo: valida coste, propiedad, proximidad y cooldown en cada acción',
      'Bloqueo de sesión en DataStore para evitar duplicados al reconectar',
      'Desarrollo por fases con decisiones, balance y changelog documentados',
    ],
    stack: ['Luau', 'Roblox', 'Rojo', 'DataStore'],
    visual: {
      type: 'tree',
      title: 'mythical-beast-tycoon/src',
      lines: [
        'server/',
        '├── Services/',
        '│   ├── BeastService',
        '│   ├── EssenceService',
        '│   ├── IncubationService',
        '│   ├── PlayerDataService',
        '│   └── SanctuaryService',
        '├── Data/DataStoreWrapper',
        '└── ServerValidation',
        'client/Controllers/',
        '├── IncubationController',
        '└── SanctuaryController',
        'shared/Config · Types · Utilities',
      ],
    },
  },
  {
    title: 'La nau PiaXXII',
    kind: 'Aventura de texto · Python',
    summary:
      'Año 2120: la nave PiaXXII ha chocado con un aerolito. El jugador tiene que reparar los propulsores y volver a la sala de mando antes de que el Malien lo atrape.',
    highlights: [
      'Diseño orientado a objetos con herencia para objetos, personajes y órdenes',
      'Intérprete de órdenes con un módulo por comando y un despachador',
      'Errores del jugador gestionados con excepciones propias',
      'Jugable aquí mismo: el código Python original se ejecuta en el navegador con Pyodide',
    ],
    stack: ['Python', 'POO', 'UML'],
    repo: 'https://github.com/Quim21/projecte-Historia-Conversacional',
    demo: '/piaxxii/',
    demoLabel: 'Jugar en el navegador',
    credits: 'Con Pol Moyano',
    visual: {
      type: 'terminal',
      title: 'python src/main.py',
      lines: [
        'Què vols fer? mapa',
        '                     [   tallers   ]',
        '                            |',
        '  [   vestuari  ]----[   oficines  ]----[    banys    ]',
        '         |                  |                  |',
        '  [    cuina    ]    [ comandament ]    [* dormitori *]',
        '         |                  |                  |',
        '         +-----------[   menjador  ]-----------+',
        '                            |',
        '                     [   exterior  ]',
        '',
        '[dormitori] Sortides: banys, menjador',
      ],
    },
  },
];

export const more: Project[] = [
  {
    title: 'Panel de estadísticas de Gem Rush',
    kind: 'Panel web · Datos',
    summary:
      'Panel con las visitas, jugadores conectados, favoritos y pases de Gem Rush. Una GitHub Action consulta la API pública de Roblox cada hora y guarda el histórico; las gráficas están hechas en SVG sin librerías.',
    stack: ['TypeScript', 'Node', 'GitHub Actions', 'API de Roblox', 'SVG'],
    repo: 'https://github.com/Quim21/Quim21.github.io/blob/main/.github/workflows/estadisticas.yml',
    demo: '/gem-rush/',
    demoLabel: 'Ver panel',
  },
  {
    title: 'Ajedrez',
    kind: 'Juego · Python',
    summary:
      'Ajedrez para dos jugadores con validación de movimientos de cada pieza, registro de piezas capturadas y tests con pytest. Se juega aquí en un tablero visual que usa las reglas del código Python original.',
    stack: ['Python', 'pytest', 'Pyodide'],
    repo: 'https://github.com/Quim21/Programacio/tree/main/Projecte%20Escacs',
    demo: '/ajedrez/',
    demoLabel: 'Jugar',
  },
  {
    title: 'RePia',
    kind: 'Aplicación web',
    summary:
      'Aplicación web con registro e inicio de sesión de usuarios. Cada usuario gestiona su propia lista de elementos (crear, editar y eliminar) guardada en Firestore.',
    stack: ['JavaScript', 'Firebase Auth', 'Firestore', 'Bootstrap'],
    repo: 'https://github.com/Quim21/repia',
    demo: 'https://quim21.github.io/repia/',
  },
];
