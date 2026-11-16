# Study protocol (draft for team review)

Follows the project proposal. Items marked ASSUMPTION are implementation decisions not stated in the proposal.

## Questions and hypotheses (from the proposal, unchanged)
- RQ1: Does a reader-adjustable interface (font, spacing, line focus, text chunking) improve reading speed, comprehension and perceived effort versus a default layout, in Urdu and English?
- RQ2: Which settings do readers choose, and do choices differ between Urdu and English?
- RQ3 (optional): Does a simplified-text option change comprehension or perceived effort?
- H1: adjustable layout gives better comprehension and lower perceived effort. H2 (exploratory): preferred spacing and size are larger for Urdu.

## Design
Within-subjects, 12 to 20 university students who read Urdu and English. Each participant reads 4 passages: 2 languages x 2 conditions. Reading is blocked by language. Counterbalanced across 8 cells (language order x condition order x passage assignment); aim for a multiple of 8 participants (16 is ideal).

## Conditions
- Default: fixed baseline (white, English 18 px / spacing 1.25, Urdu Nastaliq 22 px / spacing 2.0, no focus aids). ASSUMPTION: values to confirm in a pilot.
- Adjustable: starts at the baseline. The system suggests a configuration defined relative to the baseline and identical for both languages (size x1.1, line spacing x1.2, warm yellow background). The reader may accept it, decline it, or change anything. Each setting is tagged `baseline`, `suggested` or `reader`.
- Support from the papers: Madjidi & Crick (n=14, English) report 12 of 14 preferring a warm yellow background and all 14 preferring 1.5 line spacing. The size multiplier and the Urdu values are our assumptions; no paper tests Urdu or Nastaliq.

## Procedure
1. Facilitator enters participant number, checks the plan, hands over the device.
2. Participant reads the consent information and agrees. Declining ends the session with nothing kept.
3. For each reading: (adjustable only) untimed setup on a sample text -> Start reading -> Done reading -> 5 multiple-choice questions (passage hidden, baseline layout) -> 3 effort ratings (1-7: mental demand, effort, frustration; adapted from NASA-TLX subscales).
4. After the fourth reading: SUS (10 items, about the adjustable settings), in English or Urdu at the participant's choice (recorded).

## Measures
Reading time (ms, Start to Done), comprehension score (0-5), effort items, SUS (standard scoring, 0-100), chosen settings and their sources, timestamped settings events.

## Analysis plan (from the proposal)
Paired t-test or Wilcoxon signed-rank for speed and comprehension, per language. Descriptives for effort, SUS and settings. Interview themes (interview is run by the team, not in the app).
Notes for analysis:
- Exclude or separately analyse rows with `interrupted > 0` (timing invalid) and rows where `set_simplified = 1` (different text length, so speed is not comparable). Words per minute uses the original passage.
- Exclude `content_placeholder = 1` rows (test data).
- Settings adjusted during the reading step count towards reading time; `settings_events.csv` shows when (`t_rel_ms >= 0`).
- Urdu SUS and effort translations must be validated before real use.

## Ethics (team to confirm with the instructor)
Informed consent, voluntary, anonymous participant code, right to stop at any time with the choice to keep or delete data, no diagnosis or health information requested or stored. The consent text in the app is a draft. Data is stored in the browser on the session device and exported by the facilitator; store exports securely.

## Known limitations
Small sample; student population; baseline and suggestion values untested; simplified passages prepared by hand (must be checked for equivalent content); no gaze or scrolling data; one device and browser per session recommended for consistent rendering.
