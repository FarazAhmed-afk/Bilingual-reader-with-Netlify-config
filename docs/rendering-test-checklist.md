# Rendering and interaction test checklist (run in real browsers)

Automated tests cannot check layout. Tick each item, per browser: Chrome, Edge, Firefox, and Safari or a phone browser if available. Note failures with a screenshot.

Setup: turn off dark-mode extensions. Open the app, enter any participant number, consent, and use the adjustable layout in each language (the sample text appears first).

## Urdu (Nastaliq)
- [ ] Letters join correctly; no isolated or broken forms inside words.
- [ ] Text is right-aligned and flows right to left; the title is right-aligned.
- [ ] The Urdu full stop and question mark sit at the line end (left side) correctly.
- [ ] Numerals and mixed English words do not reorder the sentence.
- [ ] Lines do not collide at sizes 18, 22, 32 and 44 px with line spacing 2.0, 2.4 and 3.0.
- [ ] The first and last line are not clipped (ascenders and descenders visible).
- [ ] Switching to Lateef (Naskh) and back works immediately.
- [ ] Word spacing 0 to 0.5 em changes only the gaps; letter spacing is not offered.
- [ ] The language buttons show the Urdu label legibly.

## English
- [ ] Atkinson, Verdana and OpenDyslexic all load (Verdana needs the system font).
- [ ] Letter spacing 0 to 0.12 em applies live. Text is left-aligned, never justified, no hyphenation.
- [ ] Size 16 to 40 px and spacing 1.2 to 2.4 apply live.

## Settings and aids (both languages)
- [ ] Every control updates the passage immediately; Reset restores the starting layout.
- [ ] Each background keeps readable text; the swatch labels are readable without relying on colour.
- [ ] Line focus: the band sits on the right line, follows up/down arrow keys and the mouse, and re-aligns after changing size, spacing, font or window width.
- [ ] Chunking: exactly 3 wrapped lines are bright, the rest dimmed; arrows move by chunk; works together with line focus.
- [ ] Urdu line focus: the band follows the slanted baseline acceptably (no clear misalignment).
- [ ] Simplified text toggle swaps the text and the band/chunk positions stay valid.
- [ ] Suggested settings: Use suggested applies 20 px / 1.5 / warm yellow (English) and 24 px / 2.4 / warm yellow (Urdu); changing one value afterwards updates the status text.

## Study flow
- [ ] Default condition is clearly different from adjustable (badge, fixed notice, no panel).
- [ ] Timer starts at Start reading and ends at Done reading; the passage is not visible during questions.
- [ ] Questions and rating scales render RTL in Urdu and are usable by keyboard and touch.
- [ ] Stop dialog: keep, delete and continue all behave; after delete nothing appears in the data view.
- [ ] Reload mid-session shows the resume prompt; resuming flags the reading as interrupted.
- [ ] A full run for P001 to P008 shows the planned orders from the setup preview.

## Accessibility
- [ ] Everything reachable and operable by keyboard; focus ring always visible.
- [ ] Zoom to 200%: no horizontal scroll, panel stacks under the reader on narrow widths.
- [ ] Targets are at least 44 px high on a phone.
- [ ] Basic screen reader pass: controls have labels, slider values are announced.

## Data
- [ ] Export JSON and the three CSVs after a full run; open the CSVs in Excel or Sheets and check columns line up.
- [ ] Row counts: trials 4 per session; one SUS row; events match what you changed.
- [ ] `content_placeholder` is 1 while placeholders are in use.

## After deploying to Netlify
- [ ] Both Urdu and English fonts load on the live URL (disable cache, check the Network tab).
- [ ] Refreshing on any URL still loads the app.
- [ ] A session completes and exports on the live site; storage works in a normal (non-private) window.
