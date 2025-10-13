# Learnedness Validation Strategies

This note collects experiments and signals we can use before a name earns the `Learned` state. Mix and match to dial how rigorous the check should be. Everything here assumes we only track `New → Seen → Learned` for now (no `Mastered`).

## Prompt-Based Checks

- **Meaning Match** – Multiple-choice literal-meaning quiz; quick to implement and covers core recall.
- **Application Match** – Ask which practice/sadhana belongs to the name; keeps behaviour link alive.
- **Lore/Context Quiz** – Short question on the narrative/iconographic context supplied on each card.
- **Visual Spotting** – Show an icon/illustration (peacock, vel, etc.) and have the learner pick the name it represents.
- **Scenario Alignment** – Present a daily-life situation (“jealousy arises…”) and ask which name’s essence applies.

## Production Tasks

- **Type-It-Back** – Require the transliteration or literal meaning to be typed (with lenient diacritic matching).
- **One-Line Summary** – Prompt the learner to rephrase the essence in their words (min char count to avoid single-word answers).
- **Sadhana Commitment** – Collect a brief intent: “What specific action will you take today?”. Reinforces Apply.

## Sequencing & Contrast

- **Lesson Ordering** – Drag names into the correct lesson order (helps differentiate similar-sounding names).
- **Match Pairs** – Shuffle three names with three practices; match each correctly before marking Learned.
- **Group Identification** – Given three names, identify the outlier that belongs to a different lesson/theme.

## Temporal Reinforcement

- **Spaced Confirmation** – Require two successful checks separated by ≥24h. First pass toggles `Learned (pending)`, second locks it in.
- **Rolling Review Queue** – Re-test a subset of Learned names after N days to keep the badge meaningful.

## Confidence & Time Signals

- **Confidence Prompt** – After a quiz, ask for self-reported confidence (“Guessing / Somewhat / Certain”). Only mark Learned when accuracy + confidence align.
- **Dwell Time** – Minimum time spent with the modal open (e.g., 30s) combined with a correct quiz prevents accidental fast taps from counting.

## Combining Signals (Suggested Flow)

1. Open modal → Read content (dwell time check).
2. Trigger quick recall quiz (meaning/application). Passing marks `Learned (pending)`.
3. Schedule spaced revisit; second pass (possibly harder prompt) finalises `Learned`.
4. Optional reflection note or sadhana commitment feeds into review insights, even though it doesn’t gate Learned.

## Implementation Notes

- Store quiz attempts and timestamps in `/src/lib/progress` alongside `seen` and `bookmarked`.
- Keep prompts modular so we can A/B test meaning vs application questions.
- Ensure accessibility: keyboard-friendly interactions, avoid heavy reliance on drag/drop for core flow.
- Respect the contemplative tone; micro-quizzes should feel like gentle prompts, not exams.
