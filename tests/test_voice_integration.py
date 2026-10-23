"""Offline integration checks for Whispering Wilds' recorded dialogue.

Run: python -m unittest discover -s tests -p 'test_*.py'
"""
import ast
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
JS = (ROOT / "voices.js").read_text(encoding="utf-8")
CSS = (ROOT / "voices.css").read_text(encoding="utf-8")

EVENTS = {
    "caretaker_intro": "VO001.mp3",
    "caretaker_gate": "VO002.mp3",
    "caretaker_quest": "VO003.mp3",
    "caretaker_complete": "VO004.mp3",
    "ranger_intro": "VO005.mp3",
    "ranger_directions": "VO006.mp3",
    "ranger_quest": "VO007.mp3",
    "ranger_complete": "VO008.mp3",
    "trader_intro": "VO009.mp3",
    "trader_wares": "VO010.mp3",
}


class VoiceIntegrationTests(unittest.TestCase):
    def test_python_game_script_parses(self):
        scripts = re.findall(r'(?m)^<script type="py">([\s\S]*?)</script>', HTML)
        self.assertEqual(len(scripts), 1)
        ast.parse(scripts[0], filename="index.html:py")

    def test_recordings_exist_and_have_mp3_headers(self):
        for key, name in EVENTS.items():
            with self.subTest(event=key):
                data = (ROOT / name).read_bytes()
                self.assertGreater(len(data), 1000)
                self.assertTrue(data.startswith(b"ID3") or (data[0] == 255 and data[1] & 224 == 224))

    def test_every_recording_has_real_event_hook(self):
        self.assertIn('<script src="./voices.js"></script>', HTML)
        self.assertIn('href="./voices.css"', HTML)
        for event, filename in EVENTS.items():
            with self.subTest(event=event):
                self.assertIn(f'{event}: {{file:"{filename}"', JS)
                self.assertIn(f'voiced_line(game, "{event}"', HTML)

    def test_tts_is_suppressed_during_playback(self):
        self.assertIn('window.wildsVoice.isPlaying()', HTML)
        self.assertIn("speechSynthesis.cancel()", JS)

    def test_no_duplicate_input_handlers(self):
        self.assertEqual(HTML.count('send_btn.addEventListener("click"'), 1)
        self.assertEqual(HTML.count('cmd_input.addEventListener("keydown"'), 1)

    def test_accessible_dialogue_stage(self):
        for name in ("ww-character-stage", "ww-speaker", "ww-caption", "ww-replay", "ww-stop",
                     "ww-voice-toggle", "ww-voice-settings-toggle"):
            with self.subTest(element=name):
                self.assertIn(f'id="{name}"', HTML)
        self.assertIn('prefers-reduced-motion', CSS)

    def test_dialogue_only_at_relevant_quest_events(self):
        self.assertIn('if qkey == "heal_grove":\n                voiced_line(game, "caretaker_complete"', HTML)
        self.assertIn('if qkey == "mine_matters":\n                    voiced_line(game, "ranger_complete"', HTML)
        self.assertIn('if action_id == "ct_gate":', HTML)


if __name__ == "__main__":
    unittest.main()
