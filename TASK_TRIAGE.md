# Whispering Wilds — task triage and AI agent execution order

**Updated:** 2026-10-24. **Status:** triage complete; acceptance/implementation work still OPEN. **Scope:** `Parris-Tech-Services/whispering-wilds` browser game on `main`.

> ## START HERE — FIRST AVAILABLE TASK: **014.2** (P1)
> Task 014.1 production/local browser test passed 2026-10-29; proceed to targeted **014.2** negative/unearned-dialogue assertions. Do not regenerate audio or duplicate the test. The first coding action should be to inspect `tests/voice.browser.cjs`, `tests/test_voice_integration.py`, `voices.js`, `index.html` and the CI workflow, then run the offline suite and real Chromium test. Capture evidence before checking off 014.1.
>
> **Next after verified 014.1:** **014.2** (negative/unearned-dialogue assertions), then **017.1** (save state capture), following the single ordered queue below. If blocked, record the blocker and take the next independent eligible task rather than stopping.

## Canonical locations and repository boundaries

- **Authoritative web-game code and tasks:** https://github.com/Parris-Tech-Services/whispering-wilds — this repository.
- **Only authoritative open checkbox tracker for this game:** [AUDIO_INTEGRATION_TODO.md](AUDIO_INTEGRATION_TODO.md). Preserve all original IDs `014–020`, `040–048` and their numbered subtasks; never allocate an ID already present in the global VoiceBank ledger.
- **Central cross-app mirror of this game's tasks:** https://github.com/Parris-Tech-Services/ParrisVoiceBank/blob/main/AUDIO_INTEGRATION_MASTER_TODO.md (not a second place to independently choose priorities).
- **Separate Python terminal adventure:** https://github.com/joshualparris/Whispering-Wilds — its own issues, audit and instructions; **do not** merge its work into this web-game queue.
- **Other copies/test/Reloaded:** `joshuaparrisdadlan-stack/whispering-wilds`, `WhisperingWildsReloaded`, `whispering-wilds-test` are not this queue's source of truth. Do not overwrite or deploy them as if canonical.
- **Production target stated in browser CI:** https://whispering-wilds-seven.vercel.app . Confirm canonical alias and deployed Git SHA before claiming production is current. A successful GitHub Pages build does not verify this Vercel deployment.
- **Asset bank:** https://github.com/Parris-Tech-Services/ParrisVoiceBank . Reuse VO001–VO020 locally and optional Game300 recorded dialogue there; do not generate paid speech without authorisation.

## Evidence already present (do not misinterpret it)

- `tests/test_voice_integration.py` has static/structural checks; it does **not** prove all quests work interactively.
- `tests/voice.browser.cjs` already walks the twenty recorded events using genuine gameplay **commands** with test-only room/material fixtures; it also tests compact controls, duplicate quest rewards and a save/reload path. Fixtures may prepare starting conditions, but must never directly mark quests complete or trigger `voiced_line` in lieu of game commands.
- Existing GitHub Actions run [40047994072](https://github.com/Parris-Tech-Services/whispering-wilds/actions/runs/40047994072) reports successful `offline-integrity`, `browser-gameplay`, and `production-browser` jobs on **older** source SHA `427ed055` (2026-10-24). Later `voices.js` and story integration changes reached SHA `9faeb8b`; a Pages success on SHA `1bab27d` is **not** an up-to-date gameplay/production test. Run and verify current code before closing 014.1–014.3.
- A separate nine-test runner success is linked in the audio checklist for SHA `9faeb8b`. Do not extrapolate it into full browser acceptance.
- Zero-cost policy: no billed ElevenLabs generation, new paid cloud resources, repeated quota-exhausting deployments or CI runs. Prefer free/local tests before any release.

## Deterministic queue — proceed left to right, top to bottom

The identifiers below are the **existing** subtask IDs, not a renumbering. Within a phase, finish or explicitly BLOCK each entry before picking the next. Every relevant subtask is listed exactly once. Parent task closure requires its own documented acceptance proof.

| Phase | Urgency | Goal | Ordered subtasks |
| --- | --- | --- | --- |
| A | P1 | Current 20-line story/quest correctness and save safety | `014.1` → `014.2` → `017.1` → `017.2` → `017.3` → `014.3` → `047.1` → `047.3` |
| B | P1 | Inventory and quarantine new optional voices before wiring | `015.1` → `016.1` → `016.2` → `016.3` → `041.1` → `041.2` |
| C | P1 | Contextual Game300 integration (real game events only) | `015.2` → `015.3` |
| D | P1 | Single audio lifecycle and collision prevention | `018.1` → `042.1` → `018.2` → `018.3` → `042.2` → `042.3` |
| E | P1 | Controls, offline and error resilience | `020.1` → `020.2` → `020.3` → `044.1` → `044.2` → `044.3` → `044.4` → `042.4` → `020.4` |
| F | P1 | Phone usability and accessible controls | `019.1` → `019.2` → `019.3` → `045.1` → `045.2` → `045.3` → `045.4` |
| G | P2 | File correctness, mix and performance | `041.3` → `041.4` → `040.1` → `040.2` → `040.3` → `040.4` → `043.1` → `043.2` → `043.3` → `043.4` |
| H | P2 | Release verification, compatibility and permanent audit | `046.1` → `046.2` → `047.2` → `046.3` → `046.4` → `047.4` → `048.1` → `048.2` → `048.3` → `048.4` |

**Dependencies:** Complete story invariants before expanding bonus voice mapping. Classify the 100 Game300 lines and separate nonexistent characters before allowing any contextual trigger. Solve concurrent playback and stops before stress/error/mobile QA. Complete actual release verification and machine-readable asset audit last. Cross-cutting failures discovered earlier can be fixed immediately with regression tests; do not defer a production-breaking bug simply because its category appears later.

## Exact first task — 014.1

**Why now:** Gameplay and event correctness are prerequisite to introducing optional new clips; the existing 20-line test offers a high-value reusable baseline.

1. Re-check `main`, open PRs/claims, `WORK_CHECKPOINT.md` and the existing checklist. Keep branch-specific changes isolated. Read `tests/voice.browser.cjs`, `tests/test_voice_integration.py`, `voices.js`, `index.html`, `.github/workflows/voice-integration.yml`.
2. Run baseline validation from the repository root (no paid services):

   ```sh
   python -m unittest discover -s tests -p 'test_*.py' -v
   node --check voices.js
   node --check tests/voice.browser.cjs
   ```

3. If Chromium and Playwright are absent, use an existing installation or `npm install --no-save playwright@1.56.1` and `npx playwright install chromium` in an authorised free environment. Serve the root with `python -m http.server 8000 --bind 127.0.0.1` (in another terminal), then run `WW_BASE_URL=http://127.0.0.1:8000 node tests/voice.browser.cjs`. On Windows PowerShell set `$env:WW_BASE_URL='http://127.0.0.1:8000'` on its own line before `node tests/voice.browser.cjs`; this is a local shell, **not** the constrained Datto remote PowerShell console.
4. Verify **VO001–VO020** each appears under the correct actual NPC/event, is initiated by a user command, and uses the intended on-screen transcript. Confirm no spontaneous recording and no false completed quest/achievement. Note that a test using fixtures is not a manually completed natural-length game playthrough; record the coverage distinction.
5. Repeat against the confirmed current canonical production alias only after comparing deployed Git SHA and live assets. Capture browser console, network/playback traces, mobile screenshots, script exit codes and URL. A response code 200 on the MP3 does **not** prove audible playback.
6. If a reproducible failure appears, implement the smallest working repair with a regression test; rerun it locally, then the supported browser journey. Commit/merge/deploy when permitted and reverify actual production. Do not mark done simply because code was pushed.
7. Store SHA, environment, commands, pass/fail, transcript/actor/trigger coverage, any remaining gaps and links to evidence in `WORK_CHECKPOINT.md` (with detailed logs in `docs/` if needed). Check **014.1** in the canonical checklist and align the global mirror **only** when evidence meets scope.

**Definition of done for 014.1:** 20/20 true gameplay-command pathways pass at current code SHA in a real browser; speaker, caption, relevant event and playback source are correct; no game error; production-verified equivalent recorded or explicitly flagged as a separate unverified gap; reproducible test and evidence linked. Do not close the parent `014` until `014.2` and `014.3` independently pass.

## How each new AI session should operate

1. Read `AGENTS.md` → this file → `WORK_CHECKPOINT.md` → `AUDIO_INTEGRATION_TODO.md`. Fetch latest `main`, and check open PRs, branches, claims and CI before starting.
2. Choose the **first unchecked, unclaimed and unblocked** subtask in the ordered queue. Use 014.1 until proven complete; do not assume the next item based solely on an older chat or this file's update date. Existing parent IDs stay fixed.
3. **Claim it** in `WORK_CHECKPOINT.md` with `task_id`, agent, UTC timestamp, branch, plan and baseline SHA. If another agent has a live claim/PR, don't duplicate it; pick the next eligible independent task. For competing writers, re-fetch the file before updating; on conflict reconcile rather than overwrite.
4. Implement and test end-to-end: source code, regression, actual real-browser workflow, release (where allowed), live smoke, and evidence. Update `WORK_CHECKPOINT.md` at start, each milestone, before switching, and during long work. Commit it with changes; do not leave progress solely in chat.
5. Status vocabulary: `OPEN`, `IN_PROGRESS`, `BLOCKED`, `VERIFIED_COMPLETE`. Checkbox `[x]` = VERIFIED_COMPLETE **only**. For `BLOCKED`, log concrete blocker, reproduction, attempted alternatives and exact next action, then continue down the queue on an independent unclaimed item.
6. Acceptance must record exact commit SHA, test commands/results, CI status if used, browser/device evidence, live URL and deployed SHA. Distinguish older evidence, source-only tests, simulated mobile and physical-device tests. Never claim a deployment or browser test you did not verify.
7. After completion, reconcile the matching VoiceBank master checkbox without changing another app's task. The canonical local tracker remains the owner of this game's work.

## If nothing is ready

If a browser or publishing capability is genuinely unavailable, mark `014.1` BLOCKED with the missing environment and preserve existing evidence. Continue with `014.2` using static negative-case unit tests, or `015.1` inventory (no dependency on deployed browser); do not pretend this completes the blocked game playthrough. If **all** candidates are blocked, document one concrete unblock action and stop without fabricated success.

## Post-release verification and next queue step

After each verified subtask: mark the checkbox, update checkpoint and mirrored master, then select the first remaining eligible subtask from this queue. No need to ask for a new prioritisation decision each time.


## 29 October 2026 — WW 014.1 verified complete, queue advanced

- GitHub Actions [40828439293](https://github.com/Parris-Tech-Services/whispering-wilds/actions/runs/40828439293) SUCCESS all three current-source jobs: nine Python tests and JS syntax, Chromium locally on checked-out source with legitimate gameplay commands producing VO001–VO020 `playing` events, and browser replay at public production URL after exact SHA-256 match of deployed `voices.js`. Measured identical hex `5a8417222449b7c189e89238eb30d126f718ea37812c51305c481646600e6201`; audio source and clinical/gameplay logic were not edited.
- Local and hosted browser flows verified the correct speaker/caption, 20 recorded events, UI stop and mobile-width accessibility, duplicate tower reward prevented and completed quest persists on save/reload. Existing harness uses known room/material fixtures but issues real dialogue/turn-in commands; not a manual full natural-length playthrough or real physical speaker test.
- Checked 014.1 only. Next eligible ID **014.2** remains open (negative/unearned dialogue beyond the tested duplicate reward). Existing parent 014 stays OPEN until 014.2, 014.3 complete.
