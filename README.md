# Static Blog (GitHub Pages)

A markdown-driven static blog built with [Eleventy](https://www.11ty.dev/), designed to be hosted on GitHub Pages.

## Features

- **Listing page** – Homepage and `/blog/` with post lists
- **Blog posts** – One Markdown file per post in `posts/`; images supported via Markdown
- **Markdown-only authoring** – Add a `.md` file in `posts/` with front matter; it appears after build
- **Search** – Client-side search via [Pagefind](https://pagefind.app/) (sidebar “Search” button)
- **Table of contents** – Auto-generated from headings on each post
- **Sidebar** – Navigation to Home, Blog, Archive, and recent posts
- **GitHub comments** – [Giscus](https://giscus.app/) (GitHub Discussions) on each post
- **Archive** – Year-wise listing at `/archive/`
- **Categories and tags** – Filter on the Blog page via dropdowns (one active at a time: tag or category)
- **RSS** – Atom feed at `/feed/feed.xml`
- **Syntax highlighting** – Code blocks in posts (Prism)
- **Reading time** – Estimated from word count
- **Prev/next post** – Links at the bottom of each post
- **Related posts** – By tag
- **Open Graph meta** – For social sharing
- **Sitemap** – `/sitemap.xml`
- **Dark/light theme** – Toggle in sidebar (persists in `localStorage`)

## Setup

### 1. Install and run locally

```bash
npm install
npm run start
```

Open http://localhost:8080 (or the port shown).

### 2. Configure site and Giscus

Edit `_data/site.json`:

- **url** – Full site URL (e.g. `https://username.github.io/static-blog/`) for canonical links, sitemap, and feed.
- **repo** – GitHub repo (e.g. `username/static-blog`).
- **giscusRepo** – Same as `repo` for Giscus.
- **giscusRepoId** / **giscusCategoryId** – From [Giscus setup](https://giscus.app/): enable Discussions, install the app, then copy the repo ID and category ID into `site.json`.

Update feed and sitemap base URL in `eleventy.config.js` (search for `username.github.io/static-blog` and replace with your site URL).

### 3. Add a post

Create a file in `posts/` with front matter, for example:

```markdown
---
title: My First Post
date: 2025-02-22
tags:
  - general
category: General
---

Your content here. Use **markdown** and ![images](/assets/photo.jpg).
```

Rebuild (or run `npm run start` and save) to see the post.

### 4. Deploy to GitHub Pages

- Push the repo to GitHub.
- In the repo: **Settings → Pages → Build and deployment**: choose **GitHub Actions**.
- On push to `main`, the workflow in `.github/workflows/deploy.yml` builds the site and deploys to GitHub Pages.

## Scripts

- `npm run build` – Build the site and run Pagefind (output in `_site/`).
- `npm run start` – Build and serve with live reload.

## Project structure

- `posts/` – One `.md` file per blog post (front matter: title, date, tags, category).
- `_includes/` – Layouts: `base.njk`, `post.njk`, `sidebar.njk`.
- `_data/site.json` – Site metadata and Giscus config.
- `css/`, `js/`, `assets/` – Styles, scripts, and static assets.
- `_site/` – Build output (generated).
