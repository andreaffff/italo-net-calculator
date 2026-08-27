# Piano: Addizionale regionale progressiva (modello README punto 5)

## Differenza rilevata
Il README (punto 5) ora definisce l'addizionale regionale Lazio come **progressiva
per scaglioni**:
- fino a 15.000 € → 1,73%
- solo la parte oltre 15.000 € → 3,33%
- detrazione di 60 € per imponibile tra 28.001 € e 30.000 € (invariata)

Il codice attuale (`src/lib/salary.ts`, `calcolaAddizionaleRegionale`) applica invece
un'aliquota **unica su tutto l'imponibile**: 1,73% se ≤ 28.000 €, altrimenti 3,33%
su tutto. Va corretto.

Esempio con imponibile 30.000 €:
- Attuale: 30.000 × 3,33% = 999 €
- Nuovo: 15.000 × 1,73% + 15.000 × 3,33% = 259,50 + 499,50 = 759 €

## Modifiche
1. `src/lib/salary.ts`
   - Aggiorno la costante `ADD_REGIONALE_LAZIO`: soglia 15.000, aliquote 1,73% / 3,33%.
   - Riscrivo `calcolaAddizionaleRegionale` con logica progressiva:
     - se imponibile ≤ 15.000 → imponibile × 1,73%
     - altrimenti → 15.000 × 1,73% + (imponibile − 15.000) × 3,33%
     - sottraggo 60 € se imponibile > 28.000 e ≤ 30.000, mai sotto zero.
2. Verifico con uno script Bun su più RAL (12k, 16k, 20k, 30k, 33k, 80k) che
   l'addizionale corrisponda alla formula del README, inclusa la fascia con
   detrazione di 60 € (imponibile 28.001–30.000 €, cioè RAL circa 30.844–33.046 €).
3. Nessuna modifica all'interfaccia: l'etichetta "Addizionale regionale (Lazio)"
   resta valida.

## Dettagli tecnici
- Solo `src/lib/salary.ts` cambia; `calcolaNetto` usa già la funzione dedicata.
- Test di regressione sulle altre voci (IRPEF, detrazioni, comunale) invariati.
