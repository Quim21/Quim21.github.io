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
      'Game passes, icono y miniaturas de tienda listos para publicar',
    ],
    stack: ['Luau', 'Roblox', 'Rojo', 'DataStore'],
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
      'Sin dependencias: se juega con python src/main.py',
    ],
    stack: ['Python', 'POO', 'UML'],
    repo: 'https://github.com/Quim21/projecte-Historia-Conversacional',
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
    title: 'Ajedrez en terminal',
    kind: 'Juego · Python',
    summary:
      'Ajedrez para dos jugadores con tablero Unicode, validación de movimientos de cada pieza y registro de piezas capturadas. Incluye tests con pytest.',
    stack: ['Python', 'pytest'],
    repo: 'https://github.com/Quim21/Programacio/tree/main/Projecte%20Escacs',
  },
  {
    title: 'RePia',
    kind: 'Aplicación web',
    summary:
      'Aplicación web con registro e inicio de sesión de usuarios y lista de elementos que se crean, consultan y eliminan en Firestore.',
    stack: ['JavaScript', 'Firebase Auth', 'Firestore', 'Bootstrap'],
    repo: 'https://github.com/Quim21/repia',
  },
];
