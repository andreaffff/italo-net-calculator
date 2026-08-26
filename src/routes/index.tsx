import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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

// Righe del dettaglio. In questa fase i valori sono placeholder:
// le formule fiscali saranno collegate in una fase successiva.
const DETAIL_ROWS = [
  { id: "ral", label: "RAL (Retribuzione Annua Lorda)", strong: true },
  { id: "inps", label: "Contributi INPS a carico dipendente" },
  { id: "imponibile", label: "Imponibile IRPEF" },
  { id: "irpef", label: "IRPEF (a scaglioni)", expandable: true },
  { id: "regionale", label: "Addizionale regionale (Lazio)" },
  { id: "comunale", label: "Addizionale comunale (Roma)" },
  { id: "nettoAnnuo", label: "Netto annuo", strong: true },
  { id: "nettoMensile", label: "Netto mensile (×13)", strong: true },
];

function Index() {
  const [ral, setRal] = useState<string>("");
  const [showScaglioni, setShowScaglioni] = useState(false);

  const hasRal = ral.trim() !== "";

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
            Casi d'uso supportato
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
              className="h-12 rounded-lg bg-[#2563eb] px-6 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40"
            >
              Calcola
            </button>
          </div>
        </section>

        {/* Riepilogo in evidenza */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Netto annuo
            </p>
            <p className="mt-2 text-3xl font-bold text-[#0f172a]">
              {PLACEHOLDER}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Netto mensile (×13)
            </p>
            <p className="mt-2 text-3xl font-bold text-[#2563eb]">
              {PLACEHOLDER}
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
                        : "text-sm text-slate-500"
                    }
                  >
                    {PLACEHOLDER}
                  </span>
                </div>
                {row.expandable && showScaglioni && (
                  <ul className="mb-2 ml-4 space-y-1 border-l border-slate-100 pl-4">
                    <li className="flex justify-between text-xs text-slate-400">
                      <span>Scaglione 1 (fino a 28.000 €)</span>
                      <span>{PLACEHOLDER}</span>
                    </li>
                    <li className="flex justify-between text-xs text-slate-400">
                      <span>Scaglione 2 (28.000 – 50.000 €)</span>
                      <span>{PLACEHOLDER}</span>
                    </li>
                    <li className="flex justify-between text-xs text-slate-400">
                      <span>Scaglione 3 (oltre 50.000 €)</span>
                      <span>{PLACEHOLDER}</span>
                    </li>
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {!hasRal ? (
            <p className="mt-4 text-center text-xs text-slate-400">
              Inserisci una RAL per iniziare.
            </p>
          ) : (
            <p className="mt-4 text-center text-xs text-slate-400">
              Calcolo non ancora disponibile — le formule fiscali saranno
              implementate in una fase successiva.
            </p>
          )}
        </section>

        <footer className="mt-6 text-center text-xs text-slate-400">
          Prototipo dimostrativo · I valori mostrati sono placeholder.
        </footer>
      </div>
    </div>
  );
}
