# GetMyInvoices Website-Header

Animierte Komposition mit drei Hauptbereichen: **Portal-Box** (links, mit 8 wandernden Logos), **Sync-Center** (Mitte, mit Download-Symbol und Belegen) und **Smartphone** (rechts, mit Endlos-Scroll der Export-Ziele).

---

## 📁 Files in diesem Ordner

```
Website_Header/
├── index.html           Dark-Variante (Standard)
├── index-light.html     Light-Variante (für hellen Seiten-Hintergrund)
├── style.css            Styling beider Varianten (gemeinsame Datei)
├── README.md            diese Datei
└── assets/              alle Bilder, self-contained
    ├── google.svg, facebook.svg, amazon.svg, adobe.svg, openai.svg,
    │   vodafone.svg, spotify.svg          ← Portal-Logos um die Box
    ├── invoices.svg, return-arrow.svg     ← Sync-Center-Elemente
    ├── dhl.png                            ← DHL-Logo in der Box
    └── lexware-office.png, datev.png,
        addison.png, fastbill.png          ← Smartphone-Scroll-Logos
```

---

## 🎨 Was wo passiert (Layout)

| Bereich | Was ist drin | Animation |
|---|---|---|
| **Portal-Box** (links) | Inneres weißes Quadrat mit DHL-Logo + 8 Portal-Logos außen | Logos wandern entlang des dashed Border (60s pro Runde) |
| **Sync-Center** (Mitte) | Großer Kreis mit Download-Pfeil, 2 Sync-Bubbles, 2 „IN"-Belege | Statisch |
| **Smartphone** (rechts) | 4 Export-Logos (Lexware, DATEV, Addison, FastBill) | Endlos-Scroll von unten nach oben (16s pro Cycle) |

---

## 🔁 Logo-Tausch (häufiger Workflow)

### Pro Portal-Landingpage andere Logos zeigen?

**Variante A — Datei ersetzen** (einfachster Weg):
Lege ein neues Logo unter dem gleichen Filename in `assets/` ab. Funktioniert sofort, kein Code-Änderung.
Beispiel: `assets/google.svg` durch eigenes Google-Logo überschreiben → fertig.

**Variante B — Pfad ändern**:
In `index.html` die `<img src="assets/...">` oder `<image href="assets/...">` Pfade auf neue Dateien zeigen lassen. Funktioniert mit jedem Bildformat: SVG, PNG, JPG, WEBP, GIF.

### Wo sitzen die 8 Portal-Logo-Slots?

```
              ┌─────────────────────┐
              │  [Google]  [Facebook] │
              │                       │
   [Amazon]   │     Portal-Box        │   [Adobe]
              │                       │
   [OpenAI]   │                       │   [Google]
              │                       │
              │ [Vodafone]  [Spotify] │
              └─────────────────────┘
```

Im HTML in der Reihenfolge: oben-links → oben-rechts → links-oben → rechts-oben → links-unten → rechts-unten → unten-links → unten-rechts.

### Mehr/weniger Smartphone-Exports?

In `index.html` im `<div class="phone-scroll">` Block: weitere `<img>` Tags hinzufügen ODER vorhandene löschen.
**Wichtig:** Der Block ist DOPPELT — Originale + Duplikate. Beide Sets müssen synchron bleiben für den seamless Loop.

---

## ⚙️ Konfiguration

In `style.css` ganz oben:

```css
:root {
  --orbit-duration:  60s;        /* Logo-Rotation um die Box */
  --scroll-duration: 16s;        /* Smartphone-Scroll */
  --glow-color: rgba(68, 164, 220, 0.9);   /* Cyan-Glow */
}
```

Werte ändern → Animation ändert sich live.

---

## 🌗 Dark- / Light-Theme

- **Dark** (Standard): `index.html` → `<body>` ohne Klasse → `--bg-page: #060608`
- **Light**: `index-light.html` → `<body class="light">` → `--bg-page: #ffffff`

Beide Files nutzen **dieselbe `style.css`**. Im CSS gibt es einen `body.light { … }` Block der theme-abhängige Tokens überschreibt. Wenn du weitere Werte für den Light-Mode anpassen willst (z.B. dunklere Glow-Farbe für besseren Kontrast), ergänze sie dort.

---

## 🌐 Auf GitHub Pages deployen (für Axure-Embed + Entwickler-Übergabe)

**Ziel:** Eine öffentliche URL die du in Axure als iframe einbindest und dem Entwickler-Team schickst.

GitHub Pages ist gratis und genau dann sinnvoll, wenn die Entwickler den Code sowieso auch versionieren / forken / klonen sollen. Drei Wege zum Upload — wähle was am bequemsten ist:

### Option A — GitHub Web-UI (kein Installations-Aufwand)

1. Auf [github.com](https://github.com) einloggen → **„New repository"** klicken
2. **Repository name**: z.B. `gmi-header-mockup` · Visibility: **Public** (Pages auf Private braucht Pro-Account)
3. Häkchen bei **„Add a README file"** setzen → **„Create repository"**
4. Im neuen Repo auf **„Add file" → „Upload files"** klicken
5. Den **kompletten Inhalt** von `Website_Header/` (also `index.html`, `index-light.html`, `style.css`, `README.md`, `assets/`-Ordner) ins Browser-Fenster ziehen
6. Ganz unten **„Commit changes"** klicken
7. Im Repo zu **Settings → Pages** wechseln
8. Bei **„Source"**: **„Deploy from a branch"** wählen, Branch **`main`**, Folder **`/ (root)`** → **„Save"**
9. Nach **1–3 Minuten** ist die Live-URL aktiv (oben in der Pages-Section sichtbar)

### Option B — GitHub Desktop (GUI, etwas komfortabler bei Updates)

1. [GitHub Desktop](https://desktop.github.com/) installieren + einloggen
2. **„File → New Repository"** → Path = lokaler Ordner für Repo
3. Den Inhalt von `Website_Header/` ins lokale Repo-Verzeichnis kopieren
4. In GitHub Desktop: Commit-Message + **„Commit to main"** + **„Publish repository"**
5. Auf [github.com](https://github.com) → Repo öffnen → **Settings → Pages** wie in Option A Schritt 7–8

### Option C — Git CLI (für Entwickler)

```bash
cd Website_Header
git init
git add .
git commit -m "initial commit"
gh repo create gmi-header-mockup --public --source=. --push
gh api repos/:owner/gmi-header-mockup/pages -X POST -F source[branch]=main -F source[path]=/
```

### Live-URLs (nach Pages-Aktivierung)

```
Dark:   https://DEIN-USERNAME.github.io/gmi-header-mockup/
Light:  https://DEIN-USERNAME.github.io/gmi-header-mockup/index-light.html
```

Bei **Updates**: neue Files in das Repo committen / hochladen → Pages re-deployt automatisch in 1–3 Minuten.

---

## 🖼️ In Axure RP einbinden

1. Auf der Axure-Page das **„Inline Frame"-Widget** aus der Library ziehen (in „Default → Inline Frame")
2. **Größe**: 824 × 344 px (= Original-Größe der Komposition)
3. **Doppelklick** auf den Frame → **„Frame Target"** → **„Link to an external URL or local file"**
4. URL eintragen:
   - Dark-Page in Axure: `https://DEIN-USERNAME.github.io/gmi-header-mockup/`
   - Light-Page in Axure: `https://DEIN-USERNAME.github.io/gmi-header-mockup/index-light.html`
5. **„Show scrollbars: Never"** auswählen, damit keine grauen Scroll-Balken erscheinen
6. Preview in Axure → Header läuft live im Mockup, inklusive Animation

**Lokale Variante** (ohne GitHub, nur auf deinem Mac):
URL: `file:///Users/wanja.doering/Arbeit/AD/26-04-2026_FinanceOS_Webinar/Website_Header/index.html`
Funktioniert nur auf deinem Computer — für Sharing mit Kollegen zwingend GitHub Pages oder ähnliches Hosting.

---

## 👨‍💻 Entwickler-Übergabe (Lovable / Hugo)

Der Code ist Framework-agnostisch — pure HTML, CSS, SVG. Die Entwickler können:

1. **Den `Website_Header/` Ordner direkt einbauen** — funktioniert sofort
2. **CSS-Variablen anpassen** an die Brand-Style-Guides (ggf. `--glow-color`, `--orbit-duration`)
3. **In ein Component-System überführen** — die Logos als Daten-Liste (z.B. in Hugo via `data/portals.yaml`), das HTML als Template generiert

Wichtige Browser-Features die genutzt werden:
- **CSS `offset-path`** für Pfad-Animation (Chrome 55+, Firefox 72+, Safari 16+)
- **CSS `mask-image`** für Smartphone-Scroll-Fade (Chrome 120+, Safari 16+)
- **SVG-Filter** mit `feGaussianBlur` + `feFlood` für Cyan-Glows (alle Browser)

Alle Features sind in modernen Browsern (2024+) stabil.

---

## 🛠️ Häufige Anpassungen — Quick Reference

| Was ändern | Wo | Wie |
|---|---|---|
| Logos austauschen | `assets/` | Datei ersetzen oder `<img src=…>` Pfad ändern |
| Rotations-Speed | `style.css` `:root` | `--orbit-duration: 60s` |
| Scroll-Speed | `style.css` `:root` | `--scroll-duration: 16s` |
| Hintergrund-Farbe | `style.css` `:root` | `--bg-page: #060608` |
| Glow-Farbe | `style.css` `:root` | `--glow-color: rgba(...)` |
| Animation aus | `index.html` | `class="header-graphic anim-on"` → `class="header-graphic"` |
| DHL-Logo (Mitte) | `index.html` | `<image href="assets/dhl.png" …>` |
| Smartphone-Logos | `index.html` | `<div class="phone-scroll">` Block |
