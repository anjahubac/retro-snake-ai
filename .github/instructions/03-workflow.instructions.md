---
description: 'Tok rada: koraci, commit, baseline, hipoteza i evidencija.'
applyTo: '**/*'
---

# Tok rada

## Jedan korak = jedna AI iteracija

1. Pronađi zadatak koji odgovara korisničkom zahtevu u
   `docs/IMPLEMENTATION_STEPS.md`; za novi rad prvo proveri aktivne R zadatke.
   Korisnik može zadati broj ili opis posla. Predloge ne izvršavaj automatski.
2. Agent čita samo „Kontekst“ tog koraka i module iz `00-index`.
3. Agent sažme zadatak, da plan i nejasnoće, pa tek onda menja kod.
4. Agent pokreće izlaznu komandu i lepi stvarni izlaz.
5. Korisnik sam ponovo pokreće izlaznu komandu, upisuje red u
   `docs/AI_USAGE_LOG.md` i pravi commit.

Revizija plana je zaseban dokumentacioni korak: beleži provereno trenutno
stanje, odvojeno označava predlog, planiran zadatak i izvršen zadatak. Kreiranje
taska nije njegovo izvršavanje. Relativne rokove zapiši i kao datumski opseg.
Za novu mehaniku prvo uskladi spec i kriterijume, pa napravi odvojene korake
za implementaciju. Postojeće testove ne slabiti da bi nova funkcija prošla.

## Git

- Commit radi korisnik posle svakog zelenog koraka. Poruka: `tip: kratko`
  (`feat`, `fix`, `test`, `docs`, `chore`).
- Tagovi: `baseline` posle Koraka 4, `after-fix` posle Koraka 5. Ne pomeraju se.
- Baseline se **ne briše** i ne prepisuje. Poređenje: `git diff baseline after-fix -- src/`.
- Lokalni commit ne znači push. Nema push-a, deploy-a ni pull request-a bez
  izričitog zahteva korisnika.

## Hipoteza i promena (Korak 5)

- Tačno jedan problem, jedna hipoteza, jedna najmanja promena.
- Ne menjati istovremeno prompt, kontekst, šemu i kriterijume.
- Format: Tvrdnja, Signal, Hipoteza, Najmanja promena, Provera, Rezultat, Ograničenje.
- Posle promene se pokreće **isti** eval: `npm run eval`.

## Evidencija

- `docs/EVIDENCE_003.md`, `docs/EVIDENCE_004.md`: samo stvarni izlazi i komande.
- `docs/AI_USAGE_LOG.md`: jedan red po većem AI pozivu; bez chain-of-thought-a.
- Generisani izlaz se ne doteruje ručno da bi izgledao bolje.

## Kad zapneš (≈20 min)

```
Pokušavam da <cilj>.
Očekujem <očekivano ponašanje>.
Dobijam <stvarni rezultat>.
Proverila sam <komande, fajlove i pokušaje>.
Dokaz je <test, rezultat ili snimak bez tajni>.
Moje pitanje je <precizno pitanje>.
```

Sačuvaj postojeće izmene i prijavi bloker pre novog pokušaja. Ne radi
automatski stash, reset ili checkout preko korisničkog rada.
