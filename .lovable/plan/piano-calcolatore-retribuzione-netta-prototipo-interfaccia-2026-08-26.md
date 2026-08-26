# Piano: Calcolatore Retribuzione Netta — Prototipo interfaccia

## Obiettivo
Prototipo web single-page di un calcolatore di retribuzione netta italiana.
Questa fase costruisce **solo la struttura dell'interfaccia**; le formule fiscali
non vengono implementate (i valori calcolati restano placeholder).

## Cosa fa il prototipo
- L'utente inserisce una **RAL** (Retribuzione Annua Lorda).
- L'interfaccia mostra il **netto annuo** e **netto mensile** (su 13 mensilità).
- Mostra anche il **dettaglio completo** delle voci: imponibile, IRPEF a
  scaglioni, contributi INPS, addizionale regionale (Lazio) e comunale (Roma).

## Caso d'uso fissato (mostrato come assumptions in pagina)
- Dipendente privato, contratto a tempo indeterminato.
- Residente a Roma (addizionale comunale Roma, addizionale regionale Lazio).
- 13 mensilità.
- Nessuna agevolazione / situazione fiscale particolare.

## Design
- Stile: **bianco pulito**, minimale, tipografia sobria, molto spazio bianco.
- Font: titoli **Outfit**, corpo **Figtree** (caricati via `<link>` in `__root.tsx`).
- Palette: bianco `#ffffff`, sfondo sezione `#f8fafc`, testo `#0f172a`, accento `#2563eb`.
- Lingua interfaccia: **italiano**.
- Layout a singola colonna centrata, max-width ~640px, schede (card) con bordi
  sottili e angoli arrotondati. Responsive (mobile-first).

## Struttura dell'interfaccia (route `/`)
1. **Header**: titolo "Calcolatore Retribuzione Netta" + sottotitolo descrittivo.
2. **Riquadro assumptions**: elenco compatto del caso d'uso (contratto, residenza,
   mensilità, nessuna agevolazione).
3. **Input RAL**: campo numerico con etichetta, prefisso "€", placeholder
   (es. 30.000). Bottone "Calcola" (puramente visivo per ora).
4. **Riepilogo in evidenza**: due card grandi — Netto annuo e Netto mensile.
   Valori placeholder (es. "—") finché non ci sono formule.
5. **Dettaglio voci**: lista/tabella con le righe:
   - RAL (Retribuzione Annua Lorda)
   - Contributi INPS a carico dipendente
   - Imponibile IRPEF
   - IRPEF (con scaglioni visualizzati come righe secondarie)
   - Addizionale regionale (Lazio)
   - Addizionale comunale (Roma)
   - Netto annuo
   - Netto mensile (×13)
   Ogni voce ha un valore placeholder ("—"); la struttura è pronta per collegare
   le formule in una fase successiva.

## Gestione dei valori (nessuna formula)
- Stato React locale: `ral` (string/number) + valori derivati tutti vuoti.
- Quando l'utente inserisce la RAL, le card di riepilogo e le righe di dettaglio
  restituiscono placeholder ("—") con una nota "Calcolo non ancora disponibile".
- Nessuna logica fiscale, nessun tasso, nessuno scaglione hardcodato nei calcoli.

## File da modificare/creare
- `src/routes/index.tsx` — riscritta con la struttura del calcolatore (componente
  client, `useState` per RAL).
- `src/styles.css` — aggiungere font family per Outfit/Figtree se non già presenti
  e/o variabili di colore del progetto; caricare i font via `<link>` in
  `__root.tsx` (non via `@import` remoto in CSS).
- `src/routes/__root.tsx` — aggiungere `<link>` Google Fonts per Outfit + Figtree
  e aggiornare `head()` con title/description specifici e italiani.

## Out of scope (fase successiva)
- Formule IRPEF a scaglioni, aliquote INPS, addizionali regionali/comunali reali.
- Detrazioni per reddito da lavoro dipendente.
- Gestione 14ª mensilità, part-time, regime forfettario, agevolazioni.
- Persistenza dati / backend.
