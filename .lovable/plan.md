# Piano: Implementazione delle formule di calcolo

Collego il motore di calcolo all'interfaccia già esistente, seguendo esattamente
il modello di calcolo fornito.

## Parametri fissati
- Aliquota contributiva INPS a carico dipendente: **9,19%**
- Scaglioni IRPEF 2026: **23%** fino a 28.000 €, **33%** da 28.000 a 50.000 €,
  **43%** oltre 50.000 €
- Addizionale regionale Lazio: 1,73% fino a 28.000 €, 3,33% oltre;
  detrazione di 60 € per imponibile tra 28.001 € e 30.000 €
- Addizionale comunale Roma: 0,9%, esenzione per imponibile ≤ 14.000 €
- 13 mensilità, 365 giorni lavorati

## Catena di calcolo (nell'ordine del modello)
1. **Contributi INPS** = RAL × 9,19%
2. **Imponibile fiscale** = RAL − contributi
3. **IRPEF lorda** = scaglioni applicati all'imponibile fiscale
4. **Detrazione lavoro dipendente**, in funzione dell'imponibile fiscale:
   - ≤ 15.000 € → 1.955 €
   - 15.000–28.000 € → 1.910 + 1.190 × (28.000 − reddito) / 13.000
   - 28.000–50.000 € → 1.910 × (50.000 − reddito) / 22.000
   - > 50.000 € → 0 €
   - bonus +65 € se reddito tra 25.000 € e 35.000 €
   - **IRPEF netta** = max(0, IRPEF lorda − detrazione)
5. **Addizionale regionale** sull'imponibile fiscale, con la detrazione di 60 €
   nella fascia 28.001–30.000 € (mai negativa)
6. **Addizionale comunale** sull'imponibile fiscale, 0 € se ≤ 14.000 €
7. **Netto annuo** = RAL − (contributi + IRPEF netta + add. regionale + add. comunale)
8. **Netto mensile** = netto annuo / 13

## Interfaccia
La struttura attuale resta invariata; cambiano solo i valori:
- Le due card di riepilogo mostrano netto annuo e netto mensile formattati in
  euro (formato italiano, es. 22.145,30 €).
- Le righe di dettaglio mostrano i valori reali; le trattenute con segno negativo.
- Gli scaglioni IRPEF espandibili mostrano l'importo effettivo per ciascuno
  scaglione (0 € se non applicabile).
- Aggiungo due righe al dettaglio: **IRPEF lorda** e **Detrazione lavoro
  dipendente**, per rendere leggibile il passaggio 4.
- Il calcolo è reattivo: si aggiorna mentre si digita. Il bottone "Calcola" resta
  come conferma esplicita (ricalcola/valida l'input).
- Senza RAL valida (vuota, non numerica o ≤ 0) restano i placeholder "—" e la
  nota "Inserisci una RAL per iniziare".
- Sostituisco la nota "Calcolo non ancora disponibile" con una nota sulle fonti
  e sulla natura di stima del risultato (add. comunale su dati 2025).

## Dettagli tecnici
- Nuovo file `src/lib/salary.ts`: costanti (aliquote, scaglioni, soglie) e una
  funzione pura `calcolaNetto(ral: number): Breakdown` che restituisce tutte le
  voci, inclusa la ripartizione per scaglione. Nessuna dipendenza da React,
  facilmente testabile.
- `src/routes/index.tsx`: `useMemo` sul valore RAL per ottenere il breakdown,
  helper di formattazione con `Intl.NumberFormat("it-IT", { style: "currency",
  currency: "EUR" })`, rendering delle righe dai dati calcolati.
- Nessun backend, nessuna persistenza: tutto lato client.
