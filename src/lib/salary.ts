// Modello di calcolo retribuzione netta — dipendente privato, Roma, 13 mensilità.
// Tutte le funzioni sono pure e non dipendono da React.

export const ALIQUOTA_INPS = 0.0919;
export const MENSILITA = 13;

export const SCAGLIONI_IRPEF = [
  { id: "s1", label: "Scaglione 1 (fino a 28.000 €)", da: 0, a: 28000, aliquota: 0.23 },
  { id: "s2", label: "Scaglione 2 (28.000 – 50.000 €)", da: 28000, a: 50000, aliquota: 0.33 },
  { id: "s3", label: "Scaglione 3 (oltre 50.000 €)", da: 50000, a: Infinity, aliquota: 0.43 },
] as const;

export const ADD_REGIONALE_LAZIO = {
  soglia: 15000,
  aliquotaBassa: 0.0173,
  aliquotaAlta: 0.0333,
  detrazione: 60,
  detrazioneDa: 28000,
  detrazioneA: 30000,
};

export const ADD_COMUNALE_ROMA = {
  aliquota: 0.009,
  esenzioneFinoA: 14000,
};

export interface ScaglioneCalcolato {
  id: string;
  label: string;
  imponibile: number;
  imposta: number;
}

export interface Breakdown {
  ral: number;
  contributiInps: number;
  imponibileFiscale: number;
  irpefLorda: number;
  scaglioni: ScaglioneCalcolato[];
  detrazioneLavoroDipendente: number;
  irpefNetta: number;
  addizionaleRegionale: number;
  addizionaleComunale: number;
  totaleTrattenute: number;
  nettoAnnuo: number;
  nettoMensile: number;
}

export function calcolaScaglioni(imponibile: number): ScaglioneCalcolato[] {
  return SCAGLIONI_IRPEF.map((s) => {
    const quota = Math.max(0, Math.min(imponibile, s.a) - s.da);
    return {
      id: s.id,
      label: s.label,
      imponibile: quota,
      imposta: quota * s.aliquota,
    };
  });
}

export function calcolaDetrazione(reddito: number): number {
  let detrazione: number;

  if (reddito <= 15000) {
    detrazione = 1955;
  } else if (reddito <= 28000) {
    detrazione = 1910 + 1190 * ((28000 - reddito) / 13000);
  } else if (reddito <= 50000) {
    detrazione = 1910 * ((50000 - reddito) / 22000);
  } else {
    detrazione = 0;
  }

  // Ulteriore detrazione di 65 € per redditi tra 25.000 € e 35.000 €.
  if (reddito > 25000 && reddito <= 35000) {
    detrazione += 65;
  }

  return Math.max(0, detrazione);
}

export function calcolaAddizionaleRegionale(imponibile: number): number {
  const { soglia, aliquotaBassa, aliquotaAlta, detrazione, detrazioneDa, detrazioneA } =
    ADD_REGIONALE_LAZIO;

  const aliquota = imponibile <= soglia ? aliquotaBassa : aliquotaAlta;
  let importo = imponibile * aliquota;

  if (imponibile > detrazioneDa && imponibile <= detrazioneA) {
    importo -= detrazione;
  }

  return Math.max(0, importo);
}

export function calcolaAddizionaleComunale(imponibile: number): number {
  if (imponibile <= ADD_COMUNALE_ROMA.esenzioneFinoA) return 0;
  return imponibile * ADD_COMUNALE_ROMA.aliquota;
}

export function calcolaNetto(ral: number): Breakdown {
  const contributiInps = ral * ALIQUOTA_INPS;
  const imponibileFiscale = ral - contributiInps;

  const scaglioni = calcolaScaglioni(imponibileFiscale);
  const irpefLorda = scaglioni.reduce((tot, s) => tot + s.imposta, 0);

  const detrazioneLavoroDipendente = calcolaDetrazione(imponibileFiscale);
  const irpefNetta = Math.max(0, irpefLorda - detrazioneLavoroDipendente);

  const addizionaleRegionale = calcolaAddizionaleRegionale(imponibileFiscale);
  const addizionaleComunale = calcolaAddizionaleComunale(imponibileFiscale);

  const totaleTrattenute =
    contributiInps + irpefNetta + addizionaleRegionale + addizionaleComunale;
  const nettoAnnuo = ral - totaleTrattenute;

  return {
    ral,
    contributiInps,
    imponibileFiscale,
    irpefLorda,
    scaglioni,
    detrazioneLavoroDipendente,
    irpefNetta,
    addizionaleRegionale,
    addizionaleComunale,
    totaleTrattenute,
    nettoAnnuo,
    nettoMensile: nettoAnnuo / MENSILITA,
  };
}

const currencyFormatter = new Intl.NumberFormat("it-IT", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEuro(value: number): string {
  return currencyFormatter.format(value);
}
