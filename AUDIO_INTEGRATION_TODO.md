# ElevenLabs integration — numbered outstanding tasks

**Status:** OPEN / NOT YET VERIFIED. **Last inventoried:** 2026-10-24. This document is a task tracker, not evidence that the changes or playtests are done.

**Global tracker:** https://github.com/Parris-Tech-Services/ParrisVoiceBank/blob/main/AUDIO_INTEGRATION_MASTER_TODO.md

**Rules:** Global numbers are stable (001–048); check a task off only after recording the passing tests and real production verification. Reuse existing ElevenLabs assets rather than regenerating paid speech. Manual workflows are preferred to save GitHub Actions usage. Do not play audio automatically or mislabel generic TTS as a recording.

## Tasks relevant to this repository (16)

- [ ] **014** [P1] Play through all 20 original recorded dialogue triggers and verify their actual quest/story conditions
  - [x] [AI] Enumerated VO001–VO020 in `voices.js` and confirmed each event hook exists in the story source; [JPARRISDESKTOP 9-test CI pass](https://github.com/joshualparris/JoshMemory/actions/runs/40057291654), source SHA `9faeb8b`. Actual quest playthrough remains open.
  - [ ] **014.1** [AI] Run each real story/quest trigger in game, not just HTTP requests, and validate correct speaker/line.
  - [ ] **014.2** [AI] Assert unearned dialogue is impossible and confirmed events persist across saves.
  - [ ] **014.3** [AI] Capture replay and production screenshots/browser traces; retain no-cost regression tests.
- [ ] **015** [P1] Evaluate the 100 new optional recordings and connect suitable lines to genuine characters, locations and events
  - [ ] **015.1** [AI] Export all 100 Wilds Game300 lines and classify by existing NPC, location and real game event.
  - [x] [AI] Added optional matching game300 greeting/help suggestions for existing Caretaker, Ranger and Trader only (not fictional bonus-only actors, unearned rewards or quest completion); [self-hosted test pass](https://github.com/joshualparris/JoshMemory/actions/runs/40057291654).
  - [ ] **015.2** [AI] Add a small scripted condition-to-clip mapping with matching captions and nonblocking playback.
  - [ ] **015.3** [AI] Run story progression regression and mobile-width real-browser playtest.
- [ ] **016** [P1] Keep newly invented characters as bonus content until their actual gameplay exists
  - [ ] **016.1** [AI] Enumerate any Game300 speakers not implemented as playable Wilds NPCs.
  - [ ] **016.2** [AI] Keep their recordings in a clearly labelled optional gallery without claiming they live in the game.
  - [ ] **016.3** [AI] Add tests asserting no nonexistent quest, waypoint or character is triggered by bonus speech.
- [ ] **017** [P1] Check saves, quest progression and return visits after dialogue
  - [ ] **017.1** [AI] Record save data before and after dialog, quest pickup, failure, success and return visits.
  - [ ] **017.2** [AI] Verify recorded audio affects presentation only; no duplicate rewards or corrupt saves.
  - [ ] **017.3** [AI] Reload and test offline/restored story state; save automated regression.
- [ ] **018** [P1] Ensure story audio and bonus dialogue cannot overlap
  - [ ] **018.1** [AI] Identify all Wilds audio players: legacy dialogue, Game300, ambient and device speech.
  - [ ] **018.2** [AI] Implement a single interruption/stop policy for mutually exclusive voices while preserving intentional effects.
  - [ ] **018.3** [AI] Stress-test rapid game changes, overlay dismissal and audio error cleanup; zero overlap or paid API calls.
- [ ] **019** [P1] Verify the compact mobile conversation interface never obstructs gameplay
  - [ ] **019.1** [AI] Inspect phone portrait/landscape conversations at 320, 390 and 768 CSS pixels.
  - [ ] **019.2** [AI] Keep captions and voice controls inside compact/collapsible dialogue, never over game input.
  - [ ] **019.3** [AI] Check focus, touch targets, scrolling and clear gameplay return; record screenshots.
- [ ] **020** [P1] Test replay, disable, mute, interruptions, loading errors and offline behaviour
  - [ ] **020.1** [AI] Rehearse listen/stop/replay/mute, source unavailable, retry and airplane/offline behaviour.
  - [ ] **020.2** [AI] Ensure errors visibly say recording unavailable and never substitute generic TTS labelled as ElevenLabs.
  - [ ] **020.3** [AI] Preserve mute preference and make stop cancel pending remote ZIP/audio decoding.
  - [ ] **020.4** [AI] Re-run live Wilds game, save and quest tests before completion.
- [ ] **040** [P2] Audit voice consistency, pronunciation, volume, pauses and audio quality across all characters
  - [ ] **040.1** [AI] Measure loudness, peak, duration and leading/trailing silence for every approved clip using open-source tools.
  - [ ] **040.2** [AI] Flag speaker changes, clipped audio, pronunciation errors and long pauses for listening review.
  - [ ] **040.3** [AI] Apply non-destructive free gain/trim normalisation only with before/after hashes and source preserved.
  - [ ] **040.4** [AI] Test representative character clips in the actual app/game playback mix.
- [ ] **041** [P2] Check integrity, captions, wrong-file matches and broken URLs for each recording
  - [ ] **041.1** [AI] Generate a canonical ID→speaker→caption→URL→SHA-256 matrix with no duplicates.
  - [ ] **041.2** [AI] Validate all manifest references and content type/length, and audit caption versus text metadata.
  - [ ] **041.3** [AI] Test fail-fast behaviour for swapped voice files, 404, CORS and corrupt ZIP; store report.
  - [ ] **041.4** [AI] Do not close until all required clips in the specified scope pass.
- [ ] **042** [P2] Verify no overlapping audio, autoplay problems, stuck players or missing stop controls
  - [ ] **042.1** [AI] Enumerate distinct media engines per app and document precedence, pause and stop rules.
  - [ ] **042.2** [AI] Add a repeat-tap/switch/close stress test that detects overlapping voices or hanging player state.
  - [ ] **042.3** [AI] Verify no autoplay without user gesture and stop when leaving game/dialogue.
  - [ ] **042.4** [AI] Confirm screen-reader announcements remain clear when an audio error occurs.
- [ ] **043** [P2] Check loading performance and avoid unnecessarily downloading hundreds of recordings on mobile data
  - [ ] **043.1** [AI] Record startup/network bytes and lazy-load timing on a throttled simulated mobile connection.
  - [ ] **043.2** [AI] Ensure packs download on explicit interaction, cache selectively and respect audio settings.
  - [ ] **043.3** [AI] Verify bundles do not fetch all 300 clips on every page load or exhaust storage.
  - [ ] **043.4** [AI] Add performance budgets and compare measurements after optimisation.
- [ ] **044** [P2] Test fallback and retry behaviour without unexpected ElevenLabs API calls or costs
  - [ ] **044.1** [AI] Simulate offline, rate limits, 404, timeout, CORS denial and decode failure for every playback API.
  - [ ] **044.2** [AI] Assert graceful retry/disabled control with accurate voice source label.
  - [ ] **044.3** [AI] Log outbound request domains and prove no unplanned ElevenLabs/paid API calls.
  - [ ] **044.4** [AI] Preserve working offline alternatives only where approved, with no disguised device TTS.
- [ ] **045** [P2] Check accessibility, keyboard controls, reduced-motion preferences and screen-reader labels
  - [ ] **045.1** [AI] Run automated accessibility assertions for labels, focus, aria-pressed/status and heading structure.
  - [ ] **045.2** [AI] Test keyboard-only controls and switch to reduced-motion mode where relevant.
  - [ ] **045.3** [AI] Inspect mobile hit targets and long translated/recorded captions for overflow.
  - [ ] **045.4** [AI] Retest screen-reader relevant semantics after fixes.
- [ ] **046** [P2] Run project builds, automated tests, real-browser journeys and production smoke tests
  - [ ] **046.1** [AI] Record per-app build, unit, integration, browser and deployed smoke commands in a single evidence matrix.
  - [ ] **046.2** [AI] Run lowest-cost tests first, then real browser journeys (Chrome mobile/desktop) without generating speech.
  - [ ] **046.3** [AI] Gate deployment on the relevant tests; attach SHA, exit logs, network/audio proof and URL.
  - [ ] **046.4** [AI] Distinguish an independent test from GitHub Actions execution and never claim CI green when runner was blocked.
- [ ] **047** [P2] Confirm save/load, offline support and core gameplay remain unchanged where audio was added
  - [ ] **047.1** [AI] Snapshot test saves/progress before audio features and verify backwards-compatible restores.
  - [ ] **047.2** [AI] Test offline startup and cached/missing audio without breaking gameplay, exercise tracking or school-safe app features.
  - [ ] **047.3** [AI] Check changing voice settings does not change game data, achievements or scores.
  - [ ] **047.4** [AI] Perform a production upgrade/reload regression on each affected app.
- [ ] **048** [P2] Publish a central audit showing clip ID, voice, source, destination, gameplay trigger, review status and test outcome
  - [ ] **048.1** [AI] Consolidate all accessible audio manifests into one versioned inventory with ID, source, speaker, text, hash, game, trigger and deployed URL.
  - [ ] **048.2** [AI] Link QA evidence (CI/build/browser/devices), confidence level, review status and unresolved blockers per clip.
  - [ ] **048.3** [AI] Publish a machine-readable CSV/JSON and human audit in VoiceBank with source references.
  - [ ] **048.4** [AI] Reconcile all 48 task checkboxes from actual proof; leave missing/private/inaccessible items explicitly OPEN.

<!-- NO_COST_SUBTASKS_V1 -->

**Ownership:** `[AI]` = connected-tool implementation and testing; `[YOU]` = only essential account/device work. No paid services. See the master task checklist for global policy and evidence.
