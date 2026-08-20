export const ACCENT_COLORS = [
  '#3B4B8C', // azul marino
  '#2E7D5B', // verde agrícola (default)
  '#C6512E', // naranja
  '#A34D74', // morado
  '#B37B1E', // dorado
  '#6A4FA0', // púrpura
  '#2E7C8C', // azul teal
] as const;

export type AccentColor = typeof ACCENT_COLORS[number];

export const CATEGORY_COLORS = {
  suelo: '#2E7D5B',
  agua: '#3B6FB5',
  perfil: '#6A4FA0',
  planta: '#2E7D5B',
  conversion: '#3B6FB5',
  evaporacion: '#C68B2E',
  balance: '#3B6FB5',
} as const;
