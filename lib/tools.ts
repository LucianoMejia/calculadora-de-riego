export interface ToolDef {
  id: string;
  icon: string;
  name: string;
  description: string;
  category: 'suelo' | 'riego';
  colorKey: string;
}

export const TOOLS: ToolDef[] = [
  {
    id: 'densidad',
    icon: 'layers-outline',
    name: 'Densidad y porosidad',
    description: 'Calcula porosidad del suelo y masa de suelo por hectárea.',
    category: 'suelo',
    colorKey: 'suelo',
  },
  {
    id: 'humedad',
    icon: 'water-outline',
    name: 'Humedad del suelo',
    description: 'Obtén humedad gravimétrica (W%) y volumétrica (θ%).',
    category: 'suelo',
    colorKey: 'agua',
  },
  {
    id: 'lamina',
    icon: 'bar-chart-outline',
    name: 'Lámina por perfil',
    description: 'Calcula la lámina de agua por capa del perfil del suelo.',
    category: 'suelo',
    colorKey: 'perfil',
  },
  {
    id: 'lara',
    icon: 'leaf-outline',
    name: 'Agua aprovechable / LARA',
    description: 'Calcula A.A., ARA, LARA y la lámina bruta de riego.',
    category: 'riego',
    colorKey: 'planta',
  },
  {
    id: 'volumen',
    icon: 'swap-horizontal-outline',
    name: 'Lámina ↔ volumen',
    description: 'Convierte entre mm de riego y m³ de agua para un área dada.',
    category: 'riego',
    colorKey: 'conversion',
  },
  {
    id: 'evapo',
    icon: 'sunny-outline',
    name: 'Evapotranspiración',
    description: 'Estima ETc usando tanque Clase A, Kp y Kc, con proyección a N días.',
    category: 'riego',
    colorKey: 'evaporacion',
  },
  {
    id: 'balance',
    icon: 'calendar-outline',
    name: 'Balance hídrico',
    description: 'Simula día a día la LAS con lluvia, riego y ET. Encuentra el día crítico.',
    category: 'riego',
    colorKey: 'balance',
  },
];

export const TOOLS_BY_ID = Object.fromEntries(TOOLS.map(t => [t.id, t]));
