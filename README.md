# wiki-publisher

GitHub Action + Astro Starlight template that builds and publishes [OzzyCzech/wiki](https://github.com/OzzyCzech/wiki) to [ozzyczech.cz](https://ozzyczech.cz).

This is a single-purpose tool — it bakes in the site theme, sidebar, and config for ozzyczech.cz. Not designed for reuse.

## Usage

In `OzzyCzech/wiki`:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: OzzyCzech/wiki-publisher@v1
        env:
          TMDB_API_KEY: ${{ secrets.TMDB_API_KEY }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

## What the action does

1. Copies wiki content (everything in caller's repo except `.git`, `.github`, `.claude`, `CLAUDE.md`, `README.md`, `LICENSE`, `.gitignore`) into the bundled template's `src/content/docs/`.
2. Runs `npm ci && npm run build`.
3. Uploads the resulting `dist/` as a GitHub Pages artifact (the calling workflow then deploys it).

## Local preview

Clone this repo, drop wiki content into `src/content/docs/`, then `npm install && npm run dev`.
