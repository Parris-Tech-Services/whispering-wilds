/* Whispering Wilds: all twenty recorded lines mapped to matching gameplay events.
 * Audio starts only from a user-initiated game action (browser autoplay policy).
 */
(() => {
  "use strict";
  const lines = Object.freeze({
    caretaker_intro: {file:"VO001.mp3", speaker:"Caretaker", text:"This place was built to shelter travellers, not keep them. You may leave whenever you are ready."},
    caretaker_gate: {file:"VO002.mp3", speaker:"Caretaker", text:"The east gate has been stubborn for years. There is a key nearby, but metal alone will not tell you where to go."},
    caretaker_quest: {file:"VO003.mp3", speaker:"Caretaker", text:"The grove has gone quiet. Bring me two healing herbs, and I will show you what the trees have been hiding."},
    caretaker_complete: {file:"VO004.mp3", speaker:"Caretaker", text:"These are the right herbs. Thank you. Listen closely now; the grove is beginning to answer again."},
    ranger_intro: {file:"VO005.mp3", speaker:"Ranger", text:"You crossed the verge alone? Brave, perhaps. The tracks ahead say the wildlife is restless today."},
    ranger_directions: {file:"VO006.mp3", speaker:"Ranger", text:"The lake lies north, and the mine is farther east. If the birds go silent, turn around before you learn why."},
    ranger_quest: {file:"VO007.mp3", speaker:"Ranger", text:"I need two pieces of ore to mend our camp tools. Bring them back, and I will make it worth the walk."},
    ranger_complete: {file:"VO008.mp3", speaker:"Ranger", text:"That will do nicely. The next traveller may have you to thank for a sharp axe and a warm fire."},
    trader_intro: {file:"VO009.mp3", speaker:"Trader", text:"Well, you look like someone carrying a story and not quite enough supplies. What can I help you find?"},
    trader_wares: {file:"VO010.mp3", speaker:"Trader", text:"I trade in useful things. Fancy swords make noise, but a good bandage can get you home."},
    trader_quest: {file:"VO011.mp3", speaker:"Trader", text:"Two fish from the lake, please. Fresh ones, if you can manage it. My customers can tell the difference."},
    trader_complete: {file:"VO012.mp3", speaker:"Trader", text:"Now those are fine fish. Here is our bargain, and a little extra for bringing them in whole."},
    hermit_intro: {file:"VO013.mp3", speaker:"Hermit", text:"Mind the step. The hut is older than either of us, and it enjoys reminding visitors."},
    hermit_glowcaps: {file:"VO014.mp3", speaker:"Hermit", text:"Glowcaps shine brightest where the light is thinnest. Pick carefully, and leave the smallest ones behind."},
    hermit_quest: {file:"VO015.mp3", speaker:"Hermit", text:"Bring me three glowcaps. I will brew the useful part, and perhaps tell you what the blue flame means."},
    hermit_complete: {file:"VO016.mp3", speaker:"Hermit", text:"Three, just as promised. Stay a moment and watch; the brew only settles when nobody rushes it."},
    tower_intro: {file:"VO017.mp3", speaker:"Tower Watcher", text:"The old watchtower remembers every storm. It has been waiting a long time for someone willing to listen."},
    tower_riddle: {file:"VO018.mp3", speaker:"Tower Watcher", text:"The riddle is not a trick. It asks whether you can offer warmth without demanding anything back."},
    tower_complete: {file:"VO019.mp3", speaker:"Tower Watcher", text:"A coal from the dark. A kind gift for a cold place. Hear that? The stone has begun to sing."},
    tower_return: {file:"VO020.mp3", speaker:"Tower Watcher", text:"You returned. Most people only come for answers. It is good to see someone curious about the questions."}
  });
  const portraits = {
    Caretaker: { coat:"#516a63", skin:"#d3b596", hair:"#e4e8da", backdrop:"#293c3c", accent:"#d4ca92" },
    Ranger: { coat:"#486a49", skin:"#ba8b66", hair:"#624a32", backdrop:"#233d32", accent:"#b6d59b" },
    Trader: { coat:"#86604e", skin:"#dbad80", hair:"#543c31", backdrop:"#45352b", accent:"#f4c99c" }
  };
  const sound = new Audio();
  sound.preload = "none";
  let key = null, speaking = false, enabled = true, initialized = false;
  let originalVolumes = [];
  try { enabled = localStorage.getItem("wilds_recorded_voices") !== "false"; } catch (_) {}

  let game300 = null;
  void import('https://parris-voicebank.vercel.app/src/game300.js').then(module => { game300 = module; }).catch(() => {});
  const byId = id => document.getElementById(id);
  function portrait(speaker) {
    const p = portraits[speaker] || portraits.Caretaker;
    const hat = speaker === "Ranger" ?
      '<path d="M32 66 Q58 18 105 55 L114 72 Z" fill="#394c2d"/><path d="M14 71 Q72 57 132 71" stroke="#758452" stroke-width="10" fill="none" stroke-linecap="round"/>' :
      speaker === "Trader" ?
      '<path d="M25 66 Q30 16 76 26 Q121 28 119 65 Z" fill="#564032"/><path d="M11 71 Q71 58 136 71" stroke="#b98758" stroke-width="11" fill="none" stroke-linecap="round"/>' :
      '<path d="M20 105 Q13 21 72 16 Q133 17 130 105 L112 85 Q113 35 73 35 Q32 35 35 85 Z" fill="#75867e"/>';
    const facialHair = speaker === "Caretaker" ? '<path d="M53 113 Q72 145 92 113 Q84 139 72 143 Q57 135 53 113Z" fill="#dde1d6"/>' : '';
    return '<svg class="ww-portrait-svg" viewBox="0 0 144 160" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">'+
      '<rect width="144" height="160" rx="12" fill="'+p.backdrop+'"/>'+
      '<circle cx="110" cy="28" r="22" fill="'+p.accent+'" opacity=".11"/>'+
      '<g class="ww-breath"><path d="M7 164 Q17 112 50 121 L72 138 L95 121 Q131 114 139 164 Z" fill="'+p.coat+'"/>'+
      '<path d="M51 124 L73 148 L94 123" fill="none" stroke="'+p.accent+'" stroke-width="3" opacity=".6"/></g>'+
      '<path d="M39 71 Q36 36 72 34 Q110 36 106 76 L105 100 Q98 126 74 130 Q47 125 39 99Z" fill="'+p.skin+'"/>'+
      '<path d="M39 70 Q35 38 62 31 Q91 25 109 56 Q89 50 68 49 L43 77 Z" fill="'+p.hair+'"/>'+
      hat+
      '<g class="ww-face"><g class="ww-eye"><ellipse cx="56" cy="88" rx="4" ry="5" fill="#25251f"/><ellipse cx="88" cy="88" rx="4" ry="5" fill="#25251f"/></g>'+
      '<path d="M49 80 L63 78 M81 78 L95 80" stroke="#554338" stroke-width="3" stroke-linecap="round"/>'+
      '<path d="M72 91 L69 105 L76 106" fill="none" stroke="#9e7258" stroke-width="2"/>'+
      '<path class="ww-mouth" d="M63 114 Q72 119 82 114" fill="none" stroke="#4b2928" stroke-width="3" stroke-linecap="round"/>'+
      facialHair+'</g></svg>';
  }
  function updateToggle() {
    const compact = byId("ww-voice-toggle");
    if (compact) {
      compact.textContent = enabled ? "🔊" : "🔇";
      compact.setAttribute("aria-label", enabled ? "Recorded voices on" : "Recorded voices off");
      compact.setAttribute("aria-pressed", String(enabled));
      compact.title = enabled ? "Turn off recorded voices" : "Turn on recorded voices";
    }
    const settings = byId("ww-voice-settings-toggle");
    if (settings) {
      settings.textContent = "Recorded Voices: " + (enabled ? "ON" : "OFF");
      settings.setAttribute("aria-pressed", String(enabled));
    }
  }
  function setExpanded(expanded) {
    const stage = byId("ww-character-stage");
    if (stage) stage.classList.toggle("ww-expanded", Boolean(expanded));
    const button = byId("ww-expand");
    if (button) {
      button.setAttribute("aria-expanded", String(Boolean(expanded)));
      button.setAttribute("aria-label", expanded ? "Hide expanded dialogue" : "Show dialogue and larger portrait");
      button.textContent = expanded ? "⌃" : "⌄";
    }
  }
  function setSpeaking(state) {
    speaking = state;
    const stage = byId("ww-character-stage");
    if (stage) stage.classList.toggle("ww-speaking", state);
    const stateText = byId("ww-voice-state");
    if (stateText) stateText.textContent = state ? "Speaking…" : "Voice ready";
    const replay = byId("ww-replay");
    if (replay) replay.disabled = !key;
    const stop = byId("ww-stop");
    if (stop) stop.disabled = !state;
    if (state) {
      originalVolumes = [...document.querySelectorAll("audio[loop]")].map(a => [a,a.volume]);
      for (const [a,v] of originalVolumes) a.volume = Math.min(v, .09);
    } else {
      for (const [a,v] of originalVolumes) a.volume = v;
      originalVolumes = [];
    }
  }
  function stop() {
    game300?.stopGame300();
    sound.pause();
    sound.currentTime = 0;
    setSpeaking(false);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }
  function setEnabled(next) {
    enabled = Boolean(next);
    try { localStorage.setItem("wilds_recorded_voices",String(enabled)); } catch (_) {}
    updateToggle();
    if (!enabled) {
      stop();
      const stage = byId("ww-character-stage");
      if (stage) stage.hidden = true;
    }
  }
  function play(id, force = false) {
    const line = lines[id];
    if (!line) { console.warn("Unmapped dialogue", id); return false; }
    key = id;
    const stage = byId("ww-character-stage");
    if (!enabled && !force) {
      stop();
      if (stage) stage.hidden = true;
      return false;
    }
    if (stage) {
      stage.hidden = false;
      stage.dataset.speaker = line.speaker.toLowerCase();
      const name = byId("ww-speaker"), text = byId("ww-caption"), art = byId("ww-portrait");
      if (name) name.textContent = line.speaker;
      if (text) text.textContent = line.text;
      if (art) art.innerHTML = portrait(line.speaker);
    }
    stop();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    sound.src = "./" + line.file;
    sound.volume = .9;
    sound.currentTime = 0;
    setSpeaking(true);
    const attempt = sound.play();
    if (attempt && typeof attempt.catch === "function") attempt.catch(err => {
      if (sound.src.endsWith(line.file)) {
        setSpeaking(false);
        const msg = byId("ww-audio-status");
        if (msg) msg.textContent = "Audio could not start. Tap Replay to try again.";
        setExpanded(true);
        console.warn("Recorded dialogue unavailable:", line.file, err);
      }
    });
    const msg = byId("ww-audio-status");
    if (msg) msg.textContent = "";
    return true;
  }

  function mountBonusVoices(){
    const stage = byId('ww-character-stage');
    if(!stage || byId('ww-game300-bonus'))return;
    const box=document.createElement('details');box.id='ww-game300-bonus';
    box.style.cssText='margin:3px 0 5px;padding:4px 8px;border:1px solid var(--border,#536a57);border-radius:8px;font-size:13px';
    const summary=document.createElement('summary');summary.textContent='🎧 Bonus recorded conversations';box.appendChild(summary);
    const form=document.createElement('div');form.style.cssText='display:flex;gap:5px;flex-wrap:wrap;margin:6px 0;';
    const characters=['caretaker','ranger','trader','innkeeper','herbalist','scholar','ferryman','miner','gatekeeper','the_whisper'];
    const events=['greeting','help','quest','success','retry','ambient','explore','choice','farewell','surprise'];
    const select=document.createElement('select');
    for(const name of characters){const opt=document.createElement('option');opt.value=name;opt.textContent=name.replaceAll('_',' ');select.appendChild(opt);}
    select.setAttribute('aria-label','Choose recorded character');
    const hear=document.createElement('button');hear.type='button';hear.textContent='▶ Listen';
    const nextLine=document.createElement('button');nextLine.type='button';nextLine.textContent='↻ Next';
    const stopButton=document.createElement('button');stopButton.type='button';stopButton.textContent='■ Stop';
    const caption=document.createElement('p');caption.setAttribute('role','status');
    caption.style.cssText='font-size:12px;line-height:1.45;margin:6px 0;white-space:normal';
    caption.textContent='Optional recorded dialogue, including bonus characters not yet part of the main story.';
    let idx=0,ticket=0;
    const playBonus=()=>{
      if(!enabled){caption.textContent='Turn Recorded Voices on first.';return;}
      if(!game300){caption.textContent='Voice library is loading; tap Listen again.';return;}
      const mine=++ticket;
      stop(); // Pause story audio; never play two voices together.
      hear.disabled=true;caption.textContent='Loading recording…';
      void game300.playGame300('whispering_wilds',select.value,events[idx],{
        onEnd:()=>{if(mine===ticket)hear.disabled=false;}
      }).then(result=>{
        if(mine!==ticket)return;
        hear.disabled=false;
        caption.textContent=result.status==='playing'?result.text:'Recording unavailable ('+result.status+').';
      }).catch(()=>{if(mine===ticket){hear.disabled=false;caption.textContent='Recording unavailable.';}});
    };
    hear.addEventListener('click',playBonus);
    nextLine.addEventListener('click',()=>{idx=(idx+1)%events.length;playBonus();});
    select.addEventListener('change',()=>{idx=0;game300?.stopGame300();caption.textContent='Choose Listen to hear this character.';});
    stopButton.addEventListener('click',()=>{ticket++;game300?.stopGame300();hear.disabled=false;caption.textContent='Stopped.';});
    box.addEventListener('toggle',()=>{if(!box.open){ticket++;game300?.stopGame300();hear.disabled=false;}});
    form.append(select,hear,nextLine,stopButton);box.append(form,caption);
    stage.insertAdjacentElement('afterend',box);
  }
  function init() {
    if (initialized) return;
    initialized = true;
    sound.addEventListener("ended", () => setSpeaking(false));
    sound.addEventListener("error", () => {
      setSpeaking(false);
      const msg = byId("ww-audio-status");
      if (msg) msg.textContent = "Recording unavailable; dialogue text remains visible.";
      setExpanded(true);
    });
    for (const id of ["ww-voice-toggle", "ww-voice-settings-toggle"]) {
      byId(id)?.addEventListener("click", () => setEnabled(!enabled));
    }
    byId("ww-replay")?.addEventListener("click", () => { if (key) play(key, true); });
    byId("ww-stop")?.addEventListener("click", stop);
    byId("ww-expand")?.addEventListener("click", () => {
      setExpanded(!byId("ww-character-stage")?.classList.contains("ww-expanded"));
    });
    setExpanded(false);
    updateToggle();
    mountBonusVoices();
  }
  window.wildsVoice = Object.freeze({
    lines, play, stop, setEnabled, isPlaying: () => speaking, get enabled() { return enabled; }
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();