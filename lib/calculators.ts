// ===== 1. Densidad y porosidad =====
export function calcDensidad(
  da: number | null,
  dr: number | null,
  profundidad: number | null,
  area: number | null
): { porosidad: number | null; masa: number | null } {
  const porosidad = da != null && dr ? (1 - da / dr) * 100 : null;
  const masa = da != null && profundidad != null && area != null ? da * 100 * profundidad * area : null;
  return { porosidad, masa };
}

// ===== 2. Humedad del suelo =====
export function calcHumedad(
  msh: number | null,
  mss: number | null,
  wDirect: number | null,
  da: number | null
): { W: number | null; theta: number | null } {
  let W: number | null = null;
  if (wDirect != null) W = wDirect;
  else if (msh != null && mss) W = ((msh - mss) / mss) * 100;
  const theta = W != null && da != null ? W * da : null;
  return { W, theta };
}

// ===== 3. Lámina por perfil =====
export interface LayerInput {
  espesor: number | null;
  W: number | null;
  Da: number | null;
}

export interface LaminaResult {
  layerCm: number | null;
}

export function calcLaminaPerLayer(layer: LayerInput): LaminaResult {
  const { espesor, W, Da } = layer;
  if (espesor != null && W != null && Da != null) {
    return { layerCm: (W / 100) * Da * espesor };
  }
  return { layerCm: null };
}

export function calcLaminaTotal(
  layers: LayerInput[]
): { totalCm: number; totalMm: number; wProm: number } {
  let totalCm = 0;
  let sumWprof = 0;
  let sumProf = 0;

  for (const l of layers) {
    const { layerCm } = calcLaminaPerLayer(l);
    if (layerCm != null && l.espesor != null && l.W != null) {
      totalCm += layerCm;
      sumWprof += l.W * l.espesor;
      sumProf += l.espesor;
    }
  }

  return {
    totalCm,
    totalMm: totalCm * 10,
    wProm: sumProf ? sumWprof / sumProf : 0,
  };
}

// ===== 4. Agua aprovechable / LARA =====
export function calcLara(
  wcc: number | null,
  wpmp: number | null,
  da: number | null,
  prof: number | null,
  naPct: number | null,
  efPct: number | null
): {
  aaMasa: number | null;
  aaVol: number | null;
  laaMm: number | null;
  ara: number | null;
  lara: number | null;
  bruta: number | null;
} {
  const na = naPct != null ? naPct / 100 : null;
  const aaMasa = wcc != null && wpmp != null ? wcc - wpmp : null;
  const aaVol = aaMasa != null && da != null ? aaMasa * da : null;
  const laaCm = aaMasa != null && da != null && prof != null ? (aaMasa / 100) * da * prof : null;
  const laaMm = laaCm != null ? laaCm * 10 : null;
  const ara = aaMasa != null && na != null ? na * aaMasa : null;
  const lara = laaMm != null && na != null ? na * laaMm : null;
  const bruta = lara != null && efPct ? lara / (efPct / 100) : null;

  return { aaMasa, aaVol, laaMm, ara, lara, bruta };
}

// ===== 5. Lámina <-> volumen =====
export function calcVolumen(
  lam: number | null,
  area: number | null,
  volDirect: number | null
): { volumen: number | null; lamCalc: number | null } {
  const volumen = lam != null && area != null ? area * 10 * lam : null;
  const lamCalc = volDirect != null && area ? volDirect / (10 * area) : null;
  return { volumen, lamCalc };
}

// ===== 6. Evapotranspiración =====
export function calcEvapotranspiracion(
  ev: number | null,
  kp: number | null,
  kc: number | null,
  dias: number | null
): { etc: number | null; etcTotal: number | null } {
  const etc = ev != null && kp != null && kc != null ? kc * kp * ev : null;
  const etcTotal = etc != null && dias != null ? etc * dias : null;
  return { etc, etcTotal };
}

// ===== 7. Balance hídrico =====
export interface BalanceDayInput {
  lluvia: number;
  riego: number;
}

export interface BalanceDayResult {
  las: number;
  isDeficit: boolean;
  isRiegoDay: boolean;
}

export function calcBalance(
  lara: number | null,
  et: number | null,
  days: BalanceDayInput[]
): { results: BalanceDayResult[]; criticalDay: number | null } {
  const results: BalanceDayResult[] = [];
  let criticalDay: number | null = null;

  if (lara == null || et == null) {
    return { results: days.map(() => ({ las: 0, isDeficit: false, isRiegoDay: false })), criticalDay };
  }

  let las = lara;

  for (let i = 0; i < days.length; i++) {
    const d = days[i];
    if (i === 0) {
      las = lara;
    } else {
      las = las - et + d.lluvia + d.riego;
      if (las > lara) las = lara;
    }
    const isDeficit = las <= 0;
    if (isDeficit && criticalDay === null) criticalDay = i + 1;
    results.push({ las, isDeficit, isRiegoDay: d.riego > 0 });
  }

  return { results, criticalDay };
}
