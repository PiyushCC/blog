---
title: Client-Side Search with Pagefind
date: 2025-01-15
tags:
  - search
  - pagefind
  - static
category: Development
---

# Client-Side Search with Pagefind

Static sites can have great search without a backend. Pagefind indexes your built HTML after the fact.

## How it works

1. Build your site (e.g. with Eleventy).
2. Run Pagefind on the output directory – it crawls and indexes.
3. Add a small script and a container div; Pagefind injects the search UI.

Searches run in the browser against the index. No server, no API keys.

## Why Pagefind?

- **No build-time coupling** – Works with any static output.
- **Small bundle** – Index is split and loaded on demand.
- **Accessible** – Keyboard-friendly, screen-reader considerations.

If you're on a static stack and want search, Pagefind is worth a look.
