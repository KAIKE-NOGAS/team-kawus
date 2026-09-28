/**
 * ============================================
 * CATÁLOGO DE JOGOS — TEAM KAWUS
 * ============================================
 * Array escalável: basta adicionar um novo objeto
 * para o jogo aparecer no dropdown de criação de lobby.
 */

export const GAMES = [
  // --- FPS / Shooters ---
  { id: 'cod-warzone',    name: 'Call of Duty: Warzone',        category: 'FPS' },
  { id: 'cod-bo1',        name: 'Call of Duty: Black Ops I',    category: 'FPS' },
  { id: 'cod-bo2',        name: 'Call of Duty: Black Ops II',   category: 'FPS' },
  { id: 'cod-bo7',        name: 'Call of Duty: Black Ops 7',    category: 'FPS' },
  { id: 'battlefield-6',  name: 'Battlefield 6',                category: 'FPS' },
  { id: 'valorant',       name: 'Valorant',                     category: 'FPS' },

  // --- Survival / Sandbox ---
  { id: 'minecraft',      name: 'Minecraft',                    category: 'Sandbox' },
  { id: 'terraria',       name: 'Terraria',                     category: 'Sandbox' },
  { id: 'roblox',         name: 'Roblox',                       category: 'Sandbox' },
  { id: 'green-hell',     name: 'Green Hell',                   category: 'Survival' },
  { id: 'state-of-decay', name: 'State of Decay',               category: 'Survival' },

  // --- Dinosauros / Simulação ---
  { id: 'path-of-titans', name: 'Path of Titans',               category: 'Simulação' },
  { id: 'the-isle',       name: 'The Isle',                     category: 'Simulação' },

  // --- Esportes / Corrida ---
  { id: 'f1',             name: 'Formula 1',                    category: 'Corrida' },
  { id: 'ea-fc',          name: 'FIFA / EA FC',                 category: 'Esportes' },
]

/**
 * Mapa de categorias e suas cores de badge
 */
export const CATEGORY_COLORS = {
  'FPS':       'bg-red-600',
  'Sandbox':   'bg-emerald-600',
  'Survival':  'bg-amber-600',
  'Simulação': 'bg-blue-600',
  'Corrida':   'bg-purple-600',
  'Esportes':  'bg-cyan-600',
}

/**
 * Opções pré-definidas de tamanho de time
 */
export const TEAM_SIZES = [
  { value: 2,  label: 'Duo (2)' },
  { value: 3,  label: 'Trio (3)' },
  { value: 4,  label: 'Squad (4)' },
  { value: 5,  label: 'Time (5)' },
  { value: 6,  label: 'Time (6)' },
  { value: 10, label: 'Lobby (10)' },
  { value: 15, label: 'Lobby (15)' },
  { value: 20, label: 'Lobby (20+)' },
]
