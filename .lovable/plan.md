# Piano: Calcolo solo al clic del pulsante "Calcola"

## Obiettivo
Il calcolo del netto non deve più avvenire reattivamente mentre l'utente
digita la RAL, ma **solo quando l'utente clicca il pulsante "Calcola"**, come
esplicitamente richiesto dalla traccia.

## Comportamento attuale
- `src/routes/index.tsx`: `breakdown` deriva da `useMemo` su `parsedRal`, che
  si aggiorna a ogni keystroke. Il pulsante "Calcola" imposta solo `touched`
  per la validazione, senza bloccare il calcolo reattivo.

## Modifica
In `src/routes/index.tsx`:
1. Aggiungere uno stato `submittedRal: number | null` (valore RAL confermato
   dall'utente). Inizialmente `null`.
2. `breakdown` viene calcolato da `submittedRal` (non più da `parsedRal`):
   `useMemo(() => submittedRal !== null ? calcolaNetto(submittedRal) : null, [submittedRal])`.
3. Il pulsante "Calcola", al clic:
   - imposta `touched = true`
   - se `parsedRal` è valido (`!== null`), imposta `submittedRal = parsedRal`
   - se non valido, lascia `submittedRal` invariato (mostra l'errore di
     validazione già esistente).
4. La sezione di dettaglio/scaglioni e le card di riepilogo continuano a
   mostrare i placeholder "—" finché l'utente non clicca "Calcola" con una
   RAL valida.
5. Permettere anche l'invio con Enter (submit) per usabilità: gestire
   `onKeyDown` Enter sul campo input come equivalente del clic.

## Fuori scope
- Nessuna modifica alle formule (`src/lib/salary.ts` rimane invariato).
- Nessuna modifica ai valori mostrati, alla formattazione o al design.
