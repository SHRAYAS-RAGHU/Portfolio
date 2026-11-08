# Portfolio — YOUR NAME

A production-grade Angular 17 portfolio built with Tailwind CSS, featuring:
- 🔍 Multi-select tag filtering with OR/AND logic
- ⌘K Command palette search across all content
- 🎨 Dark mode with blue-accent design system
- ✨ Scroll-triggered reveal animations
- 📱 Fully responsive
- 🚀 Auto-deployed to GitHub Pages via GitHub Actions

## Quick Start

```bash
# Install dependencies
npm install

# Run locally (opens at http://localhost:4200)
npm start
```

## Personalizing Your Portfolio

### 1. Update your data
Edit `src/assets/data/data.json` — replace all `[REPLACE]` placeholders with your real content:
- `personal`: your name, bio, links, resume URL
- `stats`: your key numbers
- `experiences`: all your work with tags
- `projects`: case studies
- `systemDesigns`: architecture work
- `research`: papers and experiments
- `timeline`: career milestones

### 2. Add your photo
Place `profile.jpg` in `src/assets/images/` and uncomment the `<img>` tag in the landing component.

### 3. Add your resume
Place `resume.pdf` in `src/assets/` (or update the URL in data.json to an external link).

### 4. Add system design diagrams
Place PNG/SVG files in `src/assets/diagrams/` and reference them in `systemDesigns[].diagram`.

### 5. Deploy to GitHub Pages
1. Create a GitHub repo
2. Push this code to the `main` branch
3. Go to Settings → Pages → set source to `gh-pages` branch
4. Update the `base-href` in `.github/workflows/deploy.yml` to match your repo name
5. Every push to `main` auto-deploys

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/          — Sticky navbar with mobile menu
│   │   ├── footer/          — Footer with social links
│   │   └── command-palette/ — ⌘K search overlay
│   ├── directives/
│   │   └── scroll-reveal/   — IntersectionObserver reveal animation
│   ├── models/
│   │   └── portfolio.models.ts — TypeScript interfaces
│   ├── pages/
│   │   ├── landing/         — Home page (hero, skills, timeline teaser)
│   │   ├── experience-page/ — Filterable experience list
│   │   ├── projects-page/   — Case study cards
│   │   ├── system-design-page/ — Architecture diagrams
│   │   ├── research-page/   — Research & experiments
│   │   └── timeline-page/   — Full career timeline
│   └── services/
│       ├── data.service.ts  — Loads data.json (cached)
│       ├── filter.service.ts — Angular signals filter engine
│       └── theme.service.ts — Dark/light toggle
├── assets/
│   ├── data/data.json       — YOUR PORTFOLIO CONTENT (edit this!)
│   ├── images/              — Profile photo
│   └── diagrams/            — System design diagrams
└── styles.scss              — Global styles, design tokens, utilities
```

## Tech Stack

- **Angular 17** — standalone components, signals, computed
- **Tailwind CSS 3** — utility-first styling
- **TypeScript** — fully typed
- **GitHub Actions** — CI/CD pipeline
- **GitHub Pages** — free hosting
