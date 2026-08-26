import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  calcolaNetto,
  formatEuro,
  SCAGLIONI_IRPEF,
  type Breakdown,
} from "@/lib/salary";

export const Route = createFileRoute("/")({
  component: Index,
});

const PLACEHOLDER = "—";

const ASSUMPTIONS = [
  { label: "Contratto", value: "Dipendente privato, tempo indeterminato" },
  { label: "Residenza", value: "Roma (addizionale regionale Lazio)" },
  { label: "Mensilità", value: "13 mensilità" },
  { label: "Agevolazioni", value: "Nessuna" },
];

type RowKind = "value" | "deduction" | "credit";

interface DetailRow {
  id: string;
  label: string;
  kind: RowKind;
  strong?: boolean;
  expandable?: boolean;
  amount: (b: Breakdown) => number;
}

const DETAIL_ROWS: DetailRow[] = [
  {
    id: "ral",
    label: "RAL (Retribuzione Annua Lorda)",
    kind: "value",
    strong: true,
    amount: (b) => b.ral,
  },
  {
    id: "inps",
    label: "Contributi INPS a carico dipendente (9,19%)",
    kind: "deduction",
    amount: (b) => b.contributiInps,
  },
  {
    id: "imponibile",
    label: "Imponibile IRPEF",
    kind: "value",
    amount: (b) => b.imponibileFiscale,
  },
  {
    id: "irpefLorda",
    label: "IRPEF lorda (a scaglioni)",
    kind: "deduction",
    expandable: true,
    amount: (b) => b.irpefLorda,
  },
  {
    id: "detrazione",
    label: "Detrazione lavoro dipendente",
    kind: "credit",
    amount: (b) => b.detrazioneLavoroDipendente,
  },
  {
    id: "irpefNetta",
    label: "IRPEF netta",
    kind: "deduction",
    amount: (b) => b.irpefNetta,
  },
  {
    id: "regionale",
    label: "Addizionale regionale (Lazio)",
    kind: "deduction",
    amount: (b) => b.addizionaleRegionale,
  },
  {
    id: "comunale",
    label: "Addizionale comunale (Roma)",
    kind: "deduction",
    amount: (b) => b.addizionaleComunale,
  },
  {
    id: "nettoAnnuo",
    label: "Netto annuo",
    kind: "value",
    strong: true,
    amount: (b) => b.nettoAnnuo,
  },
  {
    id: "nettoMensile",
    label: "Netto mensile (×13)",
    kind: "value",
    strong: true,
    amount: (b) => b.nettoMensile,
  },
];

function formatRow(row: DetailRow, breakdown: Breakdown): string {
  const value = row.amount(breakdown);
  if (row.kind === "deduction") return `− ${formatEuro(value)}`;
  if (row.kind === "credit") return `+ ${formatEuro(value)}`;
  return formatEuro(value);
}

function Index() {
  const [ral, setRal] = useState<string>("");
  const [showScaglioni, setShowScaglioni] = useState(false);
  const [touched, setTouched] = useState(false);

  const parsedRal = useMemo(() => {
    const n = Number(ral.replace(",", "."));
    return ral.trim() !== "" && Number.isFinite(n) && n > 0 ? n : null;
  }, [ral]);

  const breakdown = useMemo(
    () => (parsedRal !== null ? calcolaNetto(parsedRal) : null),
    [parsedRal],
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-[640px]">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1
            className="text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            Calcolatore Retribuzione Netta
          </h1>
          <p className="mt-3 text-base text-slate-500">
            Inserisci la tua RAL per visualizzare la stima del netto annuo e
            mensile.
          </p>
        </header>

        {/* Riquadro assumptions */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2
            className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            Caso d'uso supportato
          </h2>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {ASSUMPTIONS.map((a) => (
              <div key={a.label} className="flex flex-col">
                <dt className="text-xs text-slate-400">{a.label}</dt>
                <dd className="text-sm font-medium text-[#0f172a]">
                  {a.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Input RAL */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label
            htmlFor="ral"
            className="mb-2 block text-sm font-medium text-[#0f172a]"
          >
            Retribuzione Annua Lorda (RAL)
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                €
              </span>
              <input
                id="ral"
                type="number"
                inputMode="numeric"
                min={0}
                step={100}
                value={ral}
                onChange={(e) => setRal(e.target.value)}
                placeholder="30.000"
                className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-4 text-lg text-[#0f172a] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
              />
            </div>
            <button
              type="button"
              onClick={() => setTouched(true)}
              className="h-12 rounded-lg bg-[#2563eb] px-6 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40"
            >
              Calcola
            </button>
          </div>
          {touched && parsedRal === null && (
            <p className="mt-2 text-xs text-red-500">
              Inserisci un importo valido maggiore di zero.
            </p>
          )}
        </section>

        {/* Riepilogo in evidenza */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Netto annuo
            </p>
            <p className="mt-2 text-3xl font-bold text-[#0f172a]">
              {breakdown ? formatEuro(breakdown.nettoAnnuo) : PLACEHOLDER}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Netto mensile (×13)
            </p>
            <p className="mt-2 text-3xl font-bold text-[#2563eb]">
              {breakdown ? formatEuro(breakdown.nettoMensile) : PLACEHOLDER}
            </p>
          </div>
        </section>

        {/* Dettaglio voci */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2
            className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400"
            style={{ fontFamily: '"Outfit", sans-serif' }}
          >
            Dettaglio voci
          </h2>
          <ul className="divide-y divide-slate-100">
            {DETAIL_ROWS.map((row) => (
              <li key={row.id}>
                <div className="flex items-center justify-between py-3">
                  <span
                    className={
                      row.expandable
                        ? "cursor-pointer text-sm text-[#0f172a] hover:text-[#2563eb]"
                        : row.strong
                          ? "text-sm font-semibold text-[#0f172a]"
                          : "text-sm text-slate-600"
                    }
                    onClick={() =>
                      row.expandable && setShowScaglioni((v) => !v)
                    }
                    onKeyDown={(e) => {
                      if (row.expandable && e.key === "Enter") {
                        setShowScaglioni((v) => !v);
                      }
                    }}
                    role={row.expandable ? "button" : undefined}
                    tabIndex={row.expandable ? 0 : undefined}
                  >
                    {row.label}
                    {row.expandable && (
                      <span className="ml-1 text-slate-400">
                        {showScaglioni ? "▲" : "▼"}
                      </span>
                    )}
                  </span>
                  <span
                    className={
                      row.strong
                        ? "text-sm font-bold text-[#0f172a]"
                        : row.kind === "credit"
                          ? "text-sm text-emerald-600"
                          : "text-sm text-slate-500"
                    }
                  >
                    {breakdown ? formatRow(row, breakdown) : PLACEHOLDER}
                  </span>
                </div>
                {row.expandable && showScaglioni && (
                  <div className="mb-2 ml-4 border-l border-slate-100 pl-4">
                    <p className="mb-2 text-xs leading-relaxed text-slate-400">
                      Gli scaglioni si applicano all'imponibile fiscale (RAL −
                      contributi), non alla RAL.
                    </p>
                    <ul className="space-y-1">
                      {SCAGLIONI_IRPEF.map((s, i) => {
                        const calc = breakdown?.scaglioni[i];
                        return (
                          <li
                            key={s.id}
                            className="flex justify-between gap-3 text-xs text-slate-400"
                          >
                            <span>
                              {s.label}
                              {calc && (
                                <span className="text-slate-400">
                                  {" · "}
                                  {formatEuro(calc.imponibile)} ×{" "}
                                  {(s.aliquota * 100)
                                    .toFixed(0)
                                    .replace(".", ",")}
                                  %
                                </span>
                              )}
                            </span>
                            <span className="whitespace-nowrap">
                              {calc ? formatEuro(calc.imposta) : PLACEHOLDER}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {!breakdown ? (
            <p className="mt-4 text-center text-xs text-slate-400">
              Inserisci una RAL per iniziare.
            </p>
          ) : (
            <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
              Stima indicativa. Scaglioni IRPEF 2026 (23% / 33% / 43%),
              contributi INPS 9,19%, addizionale regionale Lazio (L.R. 20/2025),
              addizionale comunale Roma 0,9% su dati 2025.
            </p>
          )}
        </section>

        <footer className="mt-6 text-center text-xs text-slate-400">
          Prototipo dimostrativo · Non sostituisce una consulenza fiscale.
        </footer>
      </div>
    </div>
  );
}
