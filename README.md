# GetMyInvoices Website Header

Animated header composition for the GetMyInvoices website. Visualizes the
portal-to-system invoice flow with three regions:

| Region | Content | Animation |
|---|---|---|
| **Left** — Portal box | Inner DHL logo + 8 portal logos | Logos orbit along the dashed border (60s/cycle), draggable |
| **Center** — Sync hub | Download icon, "IN" slips, two sync bubbles | Static |
| **Right** — Smartphone | 4 accounting export logos | Vertical infinite scroll (16s/cycle), wheel/drag, pause on hover |

Available in two visual variants that share the same animation logic:

- **Dark** (`index.html`) — default, dark page background, cyan glows
- **Light** (`index-light.html`) — white page background, soft strokes, polished arrow icons

---

## File structure

```
Website_Header/
├── README.md               this file
├── index.html              Dark variant entry point
├── index-light.html        Light variant entry point (body.light)
├── style.css               Shared styles + theme tokens
├── script.js               Animation loop + drag/wheel/touch handlers
└── assets/
    ├── common/             used by BOTH variants
    │   ├── dhl.png         center logo on the portal box
    │   ├── datev.png       phone-scroll logo (visible on both themes)
    │   └── *.svg           8 portal logos: google, facebook, adobe,
    │                       amazon, openai, spotify, vodafone
    ├── dark/               used ONLY by index.html
    │   ├── invoices.svg    "IN" invoice slips (dark version)
    │   ├── return-arrow.svg sync bubble icon (dark version)
    │   ├── lexware-office.png
    │   ├── addison.png
    │   └── fastbill.png    (phone-scroll logos, original colored versions)
    └── light/              used ONLY by index-light.html
        ├── invoices.svg    "IN" slips (soft grey version)
        ├── return-arrow.svg sync bubble (cyan-filled circle version)
        ├── arrow.svg       polished arrow used between box → center → phone
        ├── lexware-office.png
        ├── addison.png
        └── fastbill.png    (phone-scroll logos, black versions for white BG)
```

**Note on filenames:** files within `dark/` and `light/` use the same names.
The variant is selected by the folder path, keeping the HTML readable.

---

## Quick start

### Open locally

```bash
# Dark variant
open index.html

# Light variant
open index-light.html
```

No build step required — pure HTML/CSS/JS/SVG, runs in any modern browser.

### Deploy to GitHub Pages

This repo is set up to be served as-is by GitHub Pages.

1. Push to the `main` branch of your GitHub repository.
2. Open **Settings → Pages** → **Source: Deploy from a branch** → branch `main`, folder `/ (root)` → **Save**.
3. After 1–3 minutes, two URLs become live:

```
Dark:  https://<your-username>.github.io/<repo-name>/
Light: https://<your-username>.github.io/<repo-name>/index-light.html
```

### Embed in Axure RP

1. In your Axure page, add an **Inline Frame** widget (Default library → Inline Frame).
2. Set its size to **824 × 344 px** (the canvas size of the composition).
3. Double-click the frame → **Frame Target** → **Link to an external URL or local file** → paste the GitHub Pages URL.
4. Set **Show scrollbars: Never**.
5. Preview in Axure — the header runs live inside the mockup, including all animation.

Tip: add a small Axure note/post-it next to the frame with the GitHub repo URL
so developers reviewing the mockup can find the source code immediately.

---

## Customization guide

### Swap a portal logo

The 8 orbiting logos live in `/assets/common/`. The fastest way to change one:

**Option A — replace the file** (works for both variants at once):

```bash
# Drop a new google.svg over the existing one
cp my-new-google.svg assets/common/google.svg
```

**Option B — change the path** (point to a different file):

```html
<!-- in index.html / index-light.html -->
<div class="logo-anchor" style="--start-frac: 0.05;">
  <div class="logo-box"><img src="assets/common/google.svg" alt="Google"></div>
</div>
```

Supported formats: SVG, PNG, JPG, WEBP, GIF.

### Swap a phone-scroll logo

`assets/dark/` holds the colored originals (visible on the dark phone),
`assets/light/` holds the black versions (visible on the white phone).
DATEV lives in `assets/common/` because the original version works on both.

When **adding** or **removing** a logo, edit both the original set AND the
duplicate set inside `.phone-scroll` (they must stay in sync for the seamless loop):

```html
<div class="phone-scroll">
  <img src="assets/dark/lexware-office.png" alt="Lexware Office">
  <img src="assets/common/datev.png"        alt="DATEV">
  ...
  <!-- duplicate set -->
  <img src="assets/dark/lexware-office.png" alt="" aria-hidden="true">
  <img src="assets/common/datev.png"        alt="" aria-hidden="true">
  ...
</div>
```

### Per-page portal logo swap (the "DHL slot")

The DHL logo in the center of the portal box is intended as a **dynamic
per-page slot**: on the Amazon subpage it should show Amazon, on the Google
subpage it should show Google, etc. The other 8 orbiting logos around it
stay constant.

The HTML has a `★ DYNAMIC SWAP TARGET ★` comment on this `<image>` element
in both `index.html` and `index-light.html` so the spot is easy to find.

**In production templating, wire this up as a page-level parameter:**

```html
<!-- Hugo -->
<image href="{{ .Params.portalLogo | default "assets/common/dhl.png" }}" .../>

<!-- React / Lovable -->
<image href={portalLogo || "/assets/common/dhl.png"} .../>
```

Then per portal subpage:

```yaml
# content/portals/amazon/index.md
portalLogo: /assets/common/amazon.svg
```

```yaml
# content/portals/google/index.md
portalLogo: /assets/common/google.svg
```

If you instead want **one logo for all pages globally**, just replace the file
at `assets/common/dhl.png` — no code change needed.

### Animation speeds

Edit the `:root` block in `style.css`:

```css
:root {
  --orbit-duration:  60;    /* seconds per orbit cycle (logos around the box) */
  --scroll-duration: 16;    /* seconds per scroll cycle (phone)               */
  --glow-color:      rgba(68, 164, 220, 0.9);   /* logo-box halo color        */
}
```

These values are read by `script.js` at startup. Changing them takes effect on next reload.

### Colors

Most colors are inline in the SVG of `index.html` / `index-light.html`. The body
background is intentionally `transparent` in both variants — the header is meant
to overlay the existing website page background (the parent page provides its
own dark or light surroundings).

If you want to add more theme-switching tokens (e.g. shared text color), declare
them in `:root` and override inside the `body.light { … }` block at the top of
`style.css`.

---

## How the two variants differ

| Element | Dark (`index.html`) | Light (`index-light.html`) |
|---|---|---|
| `<body>` class | (none) | `light` |
| Page background | `transparent` (designed to overlay parent page) | `transparent` (designed to overlay parent page) |
| Smartphone fill | `#060608` | `#ffffff` |
| Center circle fill | dark gradient | `#ffffff` |
| Portal box fill | dark gradient | `none` (transparent) |
| All strokes | `#3c6e9d` (dark blue) | `#dde1ea` (soft grey-blue) |
| Box-to-box arrows | 2 inline SVG paths (white fill) | external `assets/light/arrow.svg` |
| "IN" slips graphic | `assets/dark/invoices.svg` | `assets/light/invoices.svg` |
| Sync bubble graphic | `assets/dark/return-arrow.svg` | `assets/light/return-arrow.svg` |
| Phone logos (Lexware, Addison, FastBill) | `assets/dark/*.png` (colored) | `assets/light/*.png` (black) |
| Phone logo DATEV | `assets/common/datev.png` | `assets/common/datev.png` |
| 8 portal logos | `assets/common/*.svg` | `assets/common/*.svg` |
| DHL center logo | `assets/common/dhl.png` | `assets/common/dhl.png` |

---

## Developer integration notes (Hugo / Lovable / React)

The code is framework-agnostic. To migrate into a build system:

- **Hugo:** Drop the folder into `static/header/` or wrap it in a layout/partial.
  The 8 portal logos can be moved to `data/portals.yaml` and the markup generated
  from that with a `range` block.
- **Lovable / React:** Convert each region (Portal box, Center, Phone) into its
  own component. Animation logic in `script.js` can be ported into a React hook
  or remain as a side-effect on mount.
- **Asset bundling:** Tools like Vite/Webpack will handle the asset imports
  automatically as long as the directory layout is preserved.

### Browser features used

- **CSS `offset-path`** — drives the orbital logo motion (Chrome 55+, Firefox 72+, Safari 16+)
- **CSS `mask-image`** — top/bottom fade on the phone scroll (Chrome 120+, Safari 16+)
- **SVG filters** (`feGaussianBlur` + `feFlood`) — cyan glows (all modern browsers)
- **`requestAnimationFrame`** — the JS animation loop (universal)

All features are stable in modern browsers (2024+). No polyfills required.

### Accessibility notes

- The SVG composition is marked `aria-hidden="true"` — it is purely decorative.
- Portal and phone-scroll `<img>` tags have meaningful `alt` text on the
  originals; duplicate set images use `alt=""` + `aria-hidden="true"` since they
  represent the same logos.
- The drag interactions use `cursor: grab` / `grabbing` for visual feedback.

---

## Maintenance checklist

When updating the header:

- [ ] Test both `index.html` and `index-light.html` after structural changes
- [ ] If a logo changes: prefer file-replace in `/assets/common/` so both variants update at once
- [ ] When editing `.phone-scroll`: keep the duplicate set in sync with the original set
- [ ] When adding new theme-switching tokens: declare in `:root` AND override in `body.light`
- [ ] After GitHub Pages deploys, hard-refresh (Cmd+Shift+R) to bypass CDN cache
