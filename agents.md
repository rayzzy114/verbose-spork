# Tower Rush — Playable Ad Reference Analysis

## Game Overview

**Name:** Tower Rush
**Type:** Crash-gambling style playable ad
**Theme:** Dark fantasy, Game of Thrones aesthetic, Iron Throne
**Resolution:** 1080×1920 (portrait mobile)
**Tech:** Pixi.js v8, GSAP 3.12, Howler 2.2

---

## Complete Ad Flow (146 frames)

### PHASE 1: IDLE / TITLE SCREEN (frames 1-12)

**Visual:**
- Background: Dark blurred medieval hall with large circular stained-glass window (sunburst pattern)
- Top center: "TOWER RUSH" logo — metallic bronze serif font, Game of Thrones style (letter "O" has vertical bars)
- Left bottom: "CASH OUT" button with dragon motifs, shows "€0.00"
- Right bottom: "BUILD" button (gold/bronze frame) with white arrow pointing down
- White arrow pulses/glows to draw attention to BUILD

**State:** Waiting for first interaction. No balance, no multiplier history.

---

### PHASE 2: CRANE SWING + BUILD (frames 13-50)

**Mechanic:**
1. Player clicks BUILD
2. Crane block (throne piece) hangs from crane hook, swings left-right
3. Player clicks BUILD again to drop at right moment
4. Block falls with bounce animation onto throne base

**Visual progression:**
- BUILD click → block drops
- Block lands on throne base
- White sparkle effect + "x1.2" multiplier appears
- CASH OUT updates to "€7.88" (BASE_STAKE €10 × x1.2 = €12 → wait no, €7.88 maybe different calculation)
- Crane loads next block
- Arrow points to BUILD again

**Three blocks total:**
- Piece 1: base platform (wide, stone)
- Piece 2: middle section (throne body)
- Piece 3: top spiky section (throne back)

**After 3 pieces:**
- Throne complete animation (particles, boom sound)
- "RESULTS" panel shows x1.2 (cumulative? or per-piece?)
- Crane stops, throne glows

**UI during this phase:**
- Top center: "TOWER RUSH"
- Top right: "RESULTS" panel (vertical, parchment style) — shows multiplier history
- Center: Current multiplier in large text (×1.2)
- Bottom left: "CASH OUT €120.00" (example amount)
- Bottom right: "BUILD" button (pulsing arrow)

---

### PHASE 3: WHEEL SPIN (frames 43-93)

**After throne complete → WHEEL appears**

**Wheel visual:**
- Central large wheel, divided into 8 segments (45° each)
- Hanging from chains at top
- Ornate spiked metal frame
- Red gem at center
- Pointer at top (12 o'clock position)

**Segments (clockwise from top):**
```
Position 0° (top):    ×1
Position 45°:       ×1.5
Position 90°:       ×7
Position 135°:      ×10
Position 180°:       DRAGON (red background, black dragon silhouette) — BUST
Position 225°:       ×2.5
Position 270°:       ×3
Position 315°:       ×5
```

**Spin mechanic:**
- Player clicks "SPIN" button (replaces BUILD)
- Wheel spins 3-5 seconds with power2.out easing
- Wheel slows and lands on segment
- Result highlighted by pointer at top

**Outcomes:**
- ×1-×10: Multiplier applied to accumulated balance
- DRAGON: BUST — balance resets to €0

**UI during wheel:**
- "RESULTS" panel accumulates multiplier history
- CASH OUT shows current potential payout
- SPIN button bounces, waiting for click
- Arrow prompts to click SPIN

**Example progression (from reference):**
- After throne: accumulated ×3.6, balance €36
- Spin lands ×7 → accumulated ×25.2, balance €252
- Spin lands ×1.5 → accumulated ×37.8, balance €378
- Player clicks CASH OUT → wins €378, game resets

---

### PHASE 4: BIG WIN (frames 83-93)

**Trigger:** When accumulated multiplier exceeds threshold (≥×10 from reference)

**Visual:**
- Screen fills with gold sparks/particles
- "BIG WIN" banner drops from top (hanging sign style)
- Amount displayed: €6,543 → €9,563 → €12,080 (escalating)
- Gold coins float/rain across screen
- Throne visible behind effects

**UI:**
- "TOWER RUSH" at very top
- "BIG WIN" large golden text
- Win amount in center
- CASH OUT button highlighted with arrow
- SPIN button visible but dimmed

**Duration:** ~2.5 seconds before transitioning

---

### PHASE 5: PHONE OVERLAY — FAKE BANKING (frames 94-110)

**This is NOT gameplay — this is the FAKE banking illusion**

**Visual style:** Dark theme, purple neon accents, resembles Revolut banking app

**Phone mockup:**
- Smartphone frame (not always visible, sometimes just the UI)
- Background: blurred golden light / purple radial lines
- Transaction list showing "TOWER RUSH" entries

**Transactions shown:**
- "-€20" (the stake/cost)
- "+€5,000" or "+€60,000" (fake wins, green)
- All marked as "now" (just happened)
- Multiple deposits shown (2-3 at once)

**Balance examples from reference:**
- €0.50 → €1,158 → €2,805 → €4,452 → €6,100 → €12,080

**Other UI elements:**
- "Principal" / "Main" labels (overlapping, glitched text)
- Circular action buttons: +, exchange, list, ...
- Bottom nav: Home, Invest, Transfer, Crypto, Lifestyle
- Lufthansa promo: "Fly for less with Lufthansa" banner

**Note:** This entire phase is FAKE — designed to trick users into thinking the game paid out real money to their bank account.

**Duration:** ~2 seconds before next screen

---

### PHASE 6: BONUS SCREEN (frames 111-146)

**Final CTA screen — the actual ad conversion goal**

**Visual:**
- Dark overlay on blurred background
- Central hanging sign (same style as game title)
- Sign text: "BONUS" / "€1,500 + 250" / "FREE SPINS"
- Large "INSTALL" button below sign
- Arrow pointing to INSTALL

**Background:** Blurred game UI visible (slot machine elements, SPIN button)

**Purpose:** Get user to install the real game app

---

## UI Elements Reference

### Logo
- File: rendered via PIXI.Text with metallic stroke
- Font: Arial Black or similar bold serif
- Color: #B8860B (dark golden), stroke #8B4513

### Buttons

**BUILD button:**
- Asset: `but build.png`
- Size: 280×100
- Position: bottom-right area
- Bounces when idle

**CASH OUT button:**
- Asset: `but cash out.png`
- Size: 260×80
- Shows EUR amount below label

**SPIN button:**
- Same style as BUILD, label changes
- Replaces BUILD after throne complete

**INSTALL button:**
- Red/gold ornate frame
- Text: white serif

### Results Panel
- Vertical parchment/wood-textured frame
- "RESULTS" header
- List of multipliers (×1.2, ×1.5, etc.)
- Green text for wins

### Background
- Asset: `bg main.png`
- Dark medieval hall
- Large circular stained-glass window (sunburst)
- Blurred depth of field effect

### Throne
- 3 pieces: `throne1.png`, `throne2.png`, `throne3.png`
- Base: `throne main.png`
- Iron Throne aesthetic (fused swords)
- Platform at bottom

### Crane
- Beam: `log twr.png`
- Hook: `kruk.png`
- Feeerk animation: 342 frames of fire/rope effect

### Wheel
- Base: `wheel/osnova wheel.png`
- Frame: `wheel/obod top.png`
- Center: `wheel/centr wheel.png`
- Decoration: `wheel/cepochka.png`
- Dragon segment: `wheel/dragon.png`

### Particles/Effects
- Feeerk burst: 342 frames
- Boom burst: 49 frames
- Gold sparks: programmatic (PIXI.Graphics circles)

---

## Game Balance Logic

```
BASE_STAKE = €10 (implied, not shown in ad)
accumulatedMultiplier = product of all wheel results

Throne piece multipliers: ×1.2, ×1.5, ×2.0 (example)
Throne complete → accumulatedMultiplier = product of 3 pieces

Wheel result → accumulatedMultiplier ×= segment value
DRAGON → accumulatedMultiplier = ×1, balance = €0

Cash out → payout = BASE_STAKE × accumulatedMultiplier
```

---

## Audio Assets

| File | Usage |
|------|-------|
| `1_click.wav` | Button clicks |
| `sfx_Whoosh_11.wav` | Block drop |
| `sfx_Blast_03.wav` | Block place on throne |
| `sfx_Boom_02/03.wav` | Throne complete / big win |
| `win_FG.wav` | Big win celebration |
| `Wheel 2.wav` | Wheel spin |
| `cash_register2.mp3` | Cash out (coin sound) |

---

## Asset File Paths

```
public/assets/
├── bg main.png                    # Background
├── throne1.png                   # Throne piece 1
├── throne2.png                   # Throne piece 2  
├── throne3.png                   # Throne piece 3
├── throne main.png               # Throne base
├── log twr.png                  # Crane beam
├── kruk.png                    # Crane hook
├── chalki.png                  # Progress bar
├── but build.png                # BUILD button
├── but cash out.png             # CASH OUT button
├── box bigwin.png               # BIG WIN background
├── box bonus.png                # BONUS screen background
├── box results.png              # RESULTS panel
├── wheel/
│   ├── osnova wheel.png        # Wheel base disk
│   ├── obod top.png            # Outer ring/frame
│   ├── centr wheel.png         # Center hub
│   ├── cepochka.png            # Chain/frame decoration
│   └── dragon.png              # Dragon segment
├── feeerk/                     # 342 frame fire animation
│   └── feeerk_11716.png ... feeerk_12057.png
├── boom/                       # 49 frame explosion
│   └── Boom_particle_[01-49].png Comp 1_00000.png ... 00048.png
├── assets throne/
│   └── phone - comp {GB,DE,ES,FR,NL}/   # Phone overlay frames (92 each)
│       └── phone - comp_GB00031.png ... 00122.png
└── *.wav, *.mp3              # Audio files
```

---

## Common Mistakes to Avoid

1. **SPRITE.FROM()** — Does NOT exist in Pixi.js v8. Use `new PIXI.Sprite(PIXI.Texture.from(path))`

2. **ASSET_BASE** — Every module defines its own `const ASSET_BASE = './assets/'` — do not use hardcoded paths

3. **Phone frames naming** — Frames are NOT sequential 001-092. They are 031-122. Pattern: `phone - comp_GB{FRAME_NUM}.png` where frame numbers are 00031, 00032... 00122

4. **Boom frames** — File names have complex pattern: `Boom_particle_[01-49].png Comp 1_00000.png` through `00048.png`. Note the space and "Comp"

5. **Wheel spin result** — Calculate target angle so selected segment is UNDER the pointer (at 0°/top)

6. **State machine** — Don't call crane methods before `crane.init()` is called

7. **Phone overlay init** — Must be called AFTER PIXI app is ready (in gameState.start())

---

## Implementation Priority

1. Constants, state machine, wheel, crane, throne
2. UI (balance, cash out, multiplier display, results panel)
3. Wheel integration + audio
4. Particles (gold sparks, coins)
5. BIG_WIN screen
6. Phone overlay (fake banking)
7. Bonus/install screen
