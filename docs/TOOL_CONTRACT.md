# TOOL_CONTRACT — get_game_state

```
Tool name:
get_game_state

Purpose:
Vraća ograničen snapshot trenutne partije potreban za AI hint.

Read/write:
READ ONLY

Allowed caller:
AI hint flow (src/ai/hintFlow.ts). Niko drugi.

Input:
{ detail: "summary" | "tactical" }
Tačno jedan ključ. Bilo koji drugi ključ ili vrednost → poziv se odbija
PRE izvršenja alata (reason: "invalid_tool_call").

Output (summary):
{ score: number, length: number, status: Status, direction: Direction }

Output (tactical) = summary +
{ head: {x,y}, food: {x,y} | null, gridSize: number,
  danger: { up: boolean, down: boolean, left: boolean, right: boolean } }
danger[d] = true ako bi pomeranje glave u smeru d sledećeg tick-a
značilo kraj (zid ili telo, rep se ne računa).

Must NOT return:
- secrets, API ključeve, environment variables
- source code
- ceo niz tela zmije, RNG, tickMs, startLength, winScore
- unrelated application state (DOM, URL, config greške)

Failure policy:
- nepoznat alat → ništa se ne izvršava (reason: "unsupported_tool")
- nevalidni argumenti → ništa se ne izvršava (reason: "invalid_tool_call")
- izlaz alata ne prolazi validateSnapshot → nema savet (reason: "invalid_tool_output")
- provider baci grešku → reason: "provider_error"
- provider ne odgovori za timeoutMs (podrazumevano 5000) → reason: "timeout"
- finalni odgovor ne prolazi validateHintResponse → reason: "invalid_final"
U svim slučajevima UI prikazuje SAFE_MESSAGE:
"AI savet trenutno nije dostupan. Igra nastavlja normalno."
```

## Allowlist

```ts
const ALLOWED_TOOLS = ["get_game_state"] as const;
```

## Finalni odgovor

```ts
type HintResponse = {
  hint: string;                                               // 1..160 znakova posle trim()
  suggestedAction: "up" | "down" | "left" | "right" | "keep";
  urgency: "low" | "medium" | "high";
};
```

Višak ključeva je greška. UI prikazuje **samo** ova tri polja kroz `textContent`,
nikad kroz `innerHTML`. UI ne izvršava `suggestedAction`, samo ga prikazuje.

## Tok (obavezna granica)

```
klik "Ask AI for Hint" (igra se pauzira)
  -> client.proposeToolCall()              (najviše jednom)
  -> validateToolCall: ime u allowlisti? argumenti tačni?   ne -> safe error, alat NIJE pozvan
  -> executeTool(state, args)              (toolCalls = 1)
  -> validateSnapshot(output, detail)                      ne -> safe error
  -> client.produceHint(snapshot)          (najviše jednom)
  -> validateHintResponse                                  ne -> safe error
  -> UI prikazuje hint ili SAFE_MESSAGE
```

## Read-only pravilo

Alat i ceo hint flow ne smeju da menjaju score, zmiju, hranu, status ni config,
ne resetuju igru, ne pišu fajlove, ne pozivaju drugi alat i nemaju petlju.
Dokaz: test u kom je `state` identičan pre i posle `requestHint` i posle
mutacije vraćenog snapshot-a.
