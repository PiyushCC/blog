---
title: Deploying to GitHub Pages
date: 2025-01-28
tags:
  - github
  - deployment
  - static
category: DevOps
---

# Deploying to GitHub Pages

GitHub Pages hosts static sites for free. Here's the simplest path.

## Option 1: GitHub Actions

Push your built site from a workflow:

1. Create `.github/workflows/deploy.yml`.
2. On push to `main`, run your build (e.g. `npm run build`).
3. Use `actions/upload-pages-artifact` and `actions/deploy-pages`.

Your `_site` or `dist` folder becomes the live site. No need to commit build output to the repo.

## Option 2: Branch or folder

Push the built output to a `gh-pages` branch, or into `docs/` on `main`, then set the source in the repo's **Settings → Pages**. Simpler, but you commit generated files.

## Custom domain

Add a `CNAME` file with your domain and configure DNS. GitHub has short docs on this. That's it – your blog can live at your own URL.
