# Adaptive Reading Interface (AHCI project)

Research prototype for the proposal "Adaptive Reading Interface for Readers with Reading Difficulties in Urdu and English" (FAST-NUCES, Applied HCI). It runs the proposed within-subjects study: default vs adjustable layout, Urdu and English, with reading time, comprehension, perceived effort, SUS and the chosen settings recorded anonymously.

## Run

```bash
npm install
npm run dev        # development
npm test           # 47 tests (unit + a jsdom full-flow test)
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```
Node 22 (see `.nvmrc`). Deployment to Netlify is configured in `netlify.toml` (build `npm run build`, publish `dist`, SPA rewrite). Nothing is deployed automatically.

## BEFORE ANY REAL SESSION: replace the placeholders

| What | Where | Status |
|---|---|---|
| 4 passages + 4 simplified versions (150-200 words each) | `src/content/passages.ts` | Placeholder, flagged `placeholder: true` |
| 20 comprehension questions (5 per passage) | `src/content/questions.ts` | Placeholder |
| Urdu effort items and Urdu SUS | `src/content/questionnaires.ts` | My translation, unvalidated |
| Consent text, `[CONTACT]`, `[COURSE]` | `src/components/Consent.tsx` | Draft, needs approval |
| Baseline and suggested values | `src/config/settings.ts`, `src/config/suggested.ts` | Design assumptions, confirm in a pilot |

The setup screen blocks the study if a real (non-placeholder) passage is outside 150-200 words, lacks a simplified version, or a passage does not have exactly 5 questions. While placeholders are present it shows a warning, and every exported row carries `content_placeholder = 1`.

## Participant flow

Facilitator setup (participant number) -> consent -> 4 readings -> SUS -> thank you.
Each reading: [adjustable only: untimed setup on sample text] -> Start reading (timer starts) -> Done reading -> 5 questions -> 3 effort ratings. The passage is hidden during questions; questions always use the fixed baseline layout. A Stop button is always available (keep or delete data).

Counterbalancing uses the participant number (P001-P999) and repeats every 8 participants: language order, condition order, and passage A/B assignment. Check the preview table on the setup screen.

## Facilitator

- Data and export: button on the setup screen, or open `/#facilitator`.
- Exports: `ahci_sessions_*.json` (everything), `ahci_trials_*.csv`, `ahci_settings_events_*.csv`, `ahci_sus_*.csv`.
- Data lives only in this browser (`localStorage`). Export after every session. Clearing browser data deletes it.
- A reload mid-session offers to resume. An interrupted reading restarts and is flagged `interrupted`.
- Turn off dark-mode browser extensions, or background colours will not mean what the app says.

## Structure

```
src/app/       App (resume/facilitator routing), adjustableReducer (settings + source tracking)
src/study/     plan (counterbalancing), studyReducer (flow state machine), scoring (SUS), schema, Study
src/components Reader, ReaderBody (line focus, chunking), SettingsPanel, Quiz, EffortScale, SusForm, ...
src/config/    languages, settings (ranges, baseline), suggested, conditions
src/content/   passages, questions, questionnaires, validate
src/data/      record, storage, export
docs/          study-protocol.md, rendering-test-checklist.md
```

## Known limitations

- Rendering and interaction have been tested by unit tests and a jsdom flow test, which have no layout engine. Line focus, chunking and Nastaliq rendering must be checked in real browsers: `docs/rendering-test-checklist.md`.
- Storage is per browser/device; no server.
- Interface text (buttons, instructions) is English only; task text is in the task language.
- Reading time is measured Start to Done and includes in-reading adjustments.
- No automatic personalisation, and no diagnosis or health data is requested or stored.
