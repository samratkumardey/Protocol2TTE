# Protocol2TTE — Project Page

Project website for **“Protocol2TTE: From Clinical Trial Knowledge to Real-World Causal Evidence Using Large Language Models and Target Trial Emulation.”**

It's a static site: plain HTML, CSS, and JS with no build step, ready for GitHub Pages.

## Structure
```
index.html                        ← the page
static/css/style.css              ← styles
static/js/main.js                 ← interactions (leaderboard, explorer, charts, table browser, zoom)
static/data/supplementary_tables.js  ← Supplementary Tables S1–S9 (generated from the .docx files)
static/images/                    ← Figs. 1–5, Supplementary Figs. S1–S2, favicon
static/supplementary/             ← original supplementary tables (.docx, downloadable from the page)
.nojekyll
```

## Deploy on GitHub Pages
1. Create a repository (e.g. `Protocol2TTE`) and push the contents of this folder to the `main` branch.
2. In the repo, go to **Settings → Pages → Build and deployment**, set **Source: Deploy from a branch**, choose **Branch: `main` / `(root)`**, and click **Save**.
3. After about a minute the site is live at `https://<username-or-org>.github.io/Protocol2TTE/`. That's the URL to cite in the abstract.

```bash
cd Protocol2TTE
git init && git add . && git commit -m "Protocol2TTE project page"
git branch -M main
git remote add origin https://github.com/<username-or-org>/Protocol2TTE.git
git push -u origin main
```

## Edit after review / acceptance
Search `index.html` for `EDIT:`.
- **Authors and affiliations**: the `.authors` and `.affil` lines in the hero.
- **Paper / Code buttons**: replace `href="#"` and remove `is-disabled` and `aria-disabled`.
- **BibTeX**: the `#bibtex` block near the end.
- **Status pill**: “Manuscript under review”.

## Updating supplementary tables
`static/data/supplementary_tables.js` was generated from the supplementary `.docx` files. If a table changes, regenerate the data (or edit the JSON directly) and replace the matching `.docx` in `static/supplementary/`.

## Credits
Layout adapted from academic project-page templates (Nerfies, DSANet, Bangla MedConv). Content © the authors. Page licensed under CC BY-SA 4.0.
