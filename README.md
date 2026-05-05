# starlight (action)

GitHub Action that builds an [Astro Starlight](https://starlight.astro.build/) site from a markdown content repository and uploads it as a GitHub Pages artifact.

A bundled Starlight skeleton lives in [`template/`](./template); the caller repo provides only its content, components, assets, and a `starlight.config.mjs`.

## Caller repo layout

```
<repo-root>/
├── starlight.config.mjs       # required — site URL, sidebar, title, social, components map
├── components/                # optional — *.astro components referenced from starlight.config.mjs
├── assets/                    # optional — logo and other src-time assets
├── public/                    # optional — favicon, og.png, CNAME, robots.txt, ...
├── style.css                  # optional — extra CSS injected via Starlight customCss
├── astro.config.mjs           # optional — full astro.config override (advanced)
├── index.md                   # optional — homepage
└── <content folders>/         # any markdown / mdx
```

`components/`, `assets/`, `public/`, `style.css`, `starlight.config.mjs`, `astro.config.mjs` and standard repo files (`.git`, `.github`, `CLAUDE.md`, `README*`, `LICENSE`, `package*.json`, `tsconfig.json`, `node_modules`, `dist`, `.astro`) are excluded from the markdown content sync. Everything else is copied into `src/content/docs/`.

## `starlight.config.mjs`

```js
export default {
  site: 'https://example.com',
  linksHostname: 'example.com',         // optional — internal-link detection for the rehype links plugin
  rss: {                                // optional — drives /rss.xml
    title: "My notes",
    description: 'Personal notes',
  },
  starlight: {
    title: 'My notes',
    customCss: ['./src/style.css'],
    components: { Head: './src/components/Head.astro' },
    sidebar: [ /* ... */ ],
    // ... any StarlightUserConfig option
  },
};
```

Paths inside `starlight.config.mjs` are interpreted from the build workdir, where:

| Caller path             | Build path             |
|-------------------------|------------------------|
| `components/Foo.astro`  | `src/components/Foo.astro` |
| `assets/logo.png`       | `src/assets/logo.png`  |
| `style.css`             | `src/style.css`        |

So write paths as `./src/components/Foo.astro`, `./src/assets/logo.png`, `./src/style.css` — or use the path aliases `@components/*`, `@assets/*` in MDX/components.

## Usage

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
      - uses: OzzyCzech/wiki-publisher@v2
        env:
          TMDB_API_KEY: ${{ secrets.TMDB_API_KEY }}    # whatever your components need

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

## Inputs

| Name           | Default | Description |
|----------------|---------|-------------|
| `content-path` | `.`     | Where in the caller repo content lives |
| `node-version` | `24`    | Node version for `setup-node` |

## Local preview

```bash
cd template
npm install
# drop a starlight.config.mjs into ./src/, content into ./src/content/docs/
npm run dev
```
