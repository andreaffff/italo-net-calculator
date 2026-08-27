#PROTITIPO CALCOLATORE RETRIBUZIONE NETTA

## ASSUNZIONI

Il prototipo considera il seguente caso standard:

- dipendente del settore privato;
- contratto a tempo indeterminato;
- 13 mensilità;
- residente fiscalmente a Roma;
- rapporto di lavoro attivo per l'intero anno;
- nessun altro reddito;
- nessuna detrazione particolare;
- nessuna agevolazione particolare;
- nessun familiare a carico.


-Quindi partendo dalla RAL tolgo i contributi -> importo a cui dovranno essere sottratte le imposte.
-A questo punto calcolo le imposte -> IRPEF + addizionali comunali e regionali
-calcolo delle detrazioni
-calcolo imposta effettiva da pagare
-calcolo del netto annuale
-calcolo del netto mensile


#FONTI
ADDIZIONALI REGIONALI : https://www.regione.lazio.it/sites/default/files/2026-01/Addizionale-regionale-2026.pdf
ADDIZIONALI COMUNALI: https://www.comune.roma.it/web/it/scheda-servizi.page?contentId=INF41403&stem=addizionale_irpef
IRPEF: https://www.agenziaentrate.gov.it/portale/imposta-sul-reddito-delle-persone-fisiche-irpef-/aliquote-e-calcolo-dell-irpef
DETRAZIONE LAVORO DIPENDENTE: https://www.agenziaentrate.gov.it/portale/documents/20143/8410823/Circolare+lavoro+dipendente+LB2025+DD+IRPEF+n.+4+del+16+maggio+2025.pdf/36979eaa-9fc5-a4ec-a7aa-136497c53f91


# MODELLO DI CALCOLO

## 1. Contributi previdenziali

RAL → contributi a carico del dipendente

Formula:
RAL × 0,0919

Fonte:
INPS


## 2. Imponibile fiscale

RAL → imponibile fiscale

Nel caso semplificato considerato, l'imponibile fiscale viene
stimato sottraendo dalla RAL i contributi previdenziali a carico
del dipendente.

Formula:

Imponibile fiscale =
RAL - contributi previdenziali

Fonte:
Agenzia delle Entrate / normativa fiscale


## 3. IRPEF lorda

Imponibile fiscale → IRPEF lorda

L'IRPEF deve essere calcolata applicando gli scaglioni
in maniera progressiva.

Per il 2026 vengono utilizzati i seguenti scaglioni:

- fino a 28.000 € → aliquota 23%
- oltre 28.000 € e fino a 50.000 € → aliquota 33%
- oltre 50.000 € → aliquota 43%

IMPORTANTE:
l'aliquota di uno scaglione deve essere applicata
SOLO alla parte di reddito che ricade all'interno
di quello scaglione.

Formula:

Se reddito <= 28.000:

    IRPEF lorda = reddito × 0,23


Se 28.000 < reddito <= 50.000:

    IRPEF lorda =
        28.000 × 0,23
        +
        (reddito - 28.000) × 0,33


Se reddito > 50.000:

    IRPEF lorda =
        28.000 × 0,23
        +
        22.000 × 0,33
        +
        (reddito - 50.000) × 0,43

Fonte:
Agenzia delle Entrate / normativa IRPEF 2026


## 4. Detrazione lavoro dipendente

Reddito complessivo → detrazione
IRPEF lorda - detrazione → IRPEF netta

La detrazione viene calcolata in funzione del reddito complessivo.

Per un dipendente che ha lavorato per tutto l'anno (365 giorni):

Reddito ≤ 15.000 €:
    detrazione = 1.955 €

15.000 € < Reddito ≤ 28.000 €:
    detrazione =
        1.910 +
        1.190 × ((28.000 - reddito) / 13.000)

28.000 € < Reddito ≤ 50.000 €:
    detrazione =
        1.910 × ((50.000 - reddito) / 22.000)

Reddito > 50.000 €:
    detrazione = 0 €

Per redditi superiori a 25.000 € e fino a 35.000 €:
    detrazione = detrazione ordinaria + 65 €

Fonte:
Agenzia delle Entrate
Art. 13 TUIR / disciplina delle detrazioni da lavoro dipendente


## 5. Addizionale regionale

Imponibile fiscale → Addizionale regionale Lazio

Per l'anno d'imposta 2026:

- fino a 15.000 € → 1,73%
- oltre 15.000 € → 3,33%

L'addizionale viene calcolata progressivamente:
l'aliquota del 3,33% viene applicata esclusivamente alla
parte di reddito superiore a 15.000 €.

Formula:

Se reddito <= 15.000:
    addizionale = reddito × 1,73%

Se reddito > 15.000:
    addizionale =
        15.000 × 1,73%
        +
        (reddito - 15.000) × 3,33%

Per redditi imponibili compresi tra 28.001 € e 30.000 € è
prevista una detrazione di 60 €.

Fonte:
Regione Lazio — Misura dell'aliquota dell'addizionale regionale
all'IRPEF — Anno d'imposta 2026.


## 6. Addizionale comunale

Imponibile fiscale → Addizionale comunale Roma

Aliquota utilizzata dal prototipo:

0,9%

Esenzione:
reddito imponibile ≤ 14.000 €

Per il prototipo sto utilizzando i dati del 2025 
siccome non sono disponibili dati aggiornati al 2026

Fonte:
Dipartimento delle Finanze —
Addizionale comunale all'IRPEF,
Comune di Roma, codice H501.


## 7. Netto annuale

Formula:

Totale trattenute =
contributi previdenziali
+ IRPEF netta
+ addizionale regionale
+ addizionale comunale

Netto annuale =
RAL - totale trattenute


## 8. Netto mensile

Formula:

Netto mensile =
Netto annuale / 13

# VALIDAZIONE

Il modello è stato verificato utilizzando diversi valori di RAL,
inclusi valori prossimi ai limiti degli scaglioni IRPEF.

Per ogni caso vengono verificati separatamente:
- contributi previdenziali
- imponibile fiscale
- IRPEF lorda
- detrazione
- IRPEF netta
- addizionale regionale
- addizionale comunale
- netto annuale
- netto mensile


# UTILIZZO DELL'AI

Lovable è stato utilizzato come strumento di prototipazione
e sviluppo.

Il modello di calcolo è stato definito separatamente sulla base
delle fonti indicate e successivamente implementato nel prototipo.

L'output generato dall'AI è stato verificato rispetto al modello
di calcolo e ai casi di test definiti.

# LIMITAZIONI

Il prototipo non rappresenta un calcolatore paghe completo.

Il risultato è una stima basata sulle assunzioni definite e sulle
semplificazioni adottate.

In particolare, non vengono gestiti:
- variazioni della situazione lavorativa durante l'anno;
- periodi di lavoro inferiori all'anno;
- altri redditi;
- particolari regimi contributivi;
- bonus e premi;
- welfare e fringe benefit;
- familiari a carico;
- lavoro straordinario;
- ulteriori detrazioni o deduzioni;
- casistiche fiscali particolari.
