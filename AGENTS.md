# Instructions for any coding agent entering Whispering Wilds

**Do not pick a random unchecked task.** The authoritative handoff is [TASK_TRIAGE.md](TASK_TRIAGE.md). The single ordered queue there starts with **014.1**, unless it has since been verified complete or claimed.

Before edits:
1. Confirm repository: `Parris-Tech-Services/whispering-wilds` on `main`. The similarly named Python text adventure at `joshualparris/Whispering-Wilds` is a separate codebase with its own task queue.
2. Read `TASK_TRIAGE.md`, `WORK_CHECKPOINT.md`, `AUDIO_INTEGRATION_TODO.md`, open PRs and branch state. If a task is being worked on, claim another independent task rather than overwrite.
3. Select **the first unclaimed, unblocked, unchecked subtask** in the triage sequence. Keep all existing IDs (014–020, 040–048 and their decimals). Don't alter parent status based on one subtask.
4. Record an `IN_PROGRESS` claim in `WORK_CHECKPOINT.md`, with task/owner/time/branch/baseline SHA. Check again before writing to avoid two agents racing.
5. Solve the task end-to-end within authorised means. Prefer existing tests and recordings. Run free offline tests, then real-browser tests, fix reproducible faults, verify source and production release where possible.
6. Tick a task only for `VERIFIED_COMPLETE` with reproducible proof: tested SHA, commands/results, real user journey, deployed URL/SHA or explicit acceptance exception. Keep `BLOCKED` tasks unchecked, explain what specifically blocks them, then continue another eligible task.
7. Commit task changes **and** checkpoint updates. Keep the corresponding ParrisVoiceBank master tracker aligned only after confirmed completion. Never rename existing IDs or duplicate a task in a new backlog.
8. Don't pay for ElevenLabs generation, GitHub runners or hosting. Don't introduce unrequested speech, falsely label device TTS, grant bogus quest rewards, or download hundreds of MP3s on mobile load.
9. Use 10–15 minute durable checkpoints during longer engagements; create a fresh checkpoint before switching tasks. Never claim live playtesting based solely on a source/HTTP/CI check.

**First task quick start:** Inspect `tests/voice.browser.cjs` and the recorded events in `voices.js`. Use `python -m unittest discover -s tests -p 'test_*.py' -v`, `node --check voices.js` and `node --check tests/voice.browser.cjs`. Then serve `index.html` locally and run `node tests/voice.browser.cjs` with Playwright against that server. Full commands and the release gate are in `TASK_TRIAGE.md`.
