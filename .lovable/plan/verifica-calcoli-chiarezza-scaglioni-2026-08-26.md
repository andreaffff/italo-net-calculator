# Verifica calcoli + chiarezza scaglioni

## Esito della verifica

Ho confrontato riga per riga il codice con il modello di calcolo su RAL da 12.000 a
100.000 €: contributi, IRPEF lorda progressiva, detrazione (incluso il +65 €),
addizionale regionale con detrazione 28.001–30.000 €, addizionale comunale con
esenzione fino a 14.000 €, netto annuo e mensile coincidono in tutti i casi.

Esempio RAL 30.000 €:
- contributi 2.757,00 € → imponibile 27.243,00 €
- IRPEF lorda 6.265,89 € (tutta nel primo scaglione, perché 27.243 < 28.000)
- detrazione 2.044,29 € → IRPEF netta 4.221,60 €
- add. regionale 471,30 € · add. comunale 245,19 €
- netto annuo 22.304,91 € · mensile 1.715,76 €

Nessuna correzione di formule è necessaria.

## Unica modifica proposta (solo interfaccia)

Il dubbio nasce dal fatto che gli scaglioni sembrano "non calcolati". Rendo
esplicita la progressività:

- Nella riga espandibile degli scaglioni mostro, per ciascuno, anche la quota di
  imponibile che vi ricade e l'aliquota: es. "Scaglione 1 · 27.243,00 € × 23%" a
  sinistra e l'imposta a destra.
- Sopra la lista aggiungo una nota breve: "Gli scaglioni si applicano
  all'imponibile fiscale (RAL − contributi), non alla RAL."
- Gli scaglioni non applicabili restano visibili a 0,00 €, ma con la quota 0 €
  esplicita, così è chiaro che sono stati considerati.

## Dettagli tecnici

Solo `src/routes/index.tsx`: rendering della sotto-lista degli scaglioni usando
`imponibile` e l'aliquota già presenti in `Breakdown` / `SCAGLIONI_IRPEF`.
`src/lib/salary.ts` resta invariato.
