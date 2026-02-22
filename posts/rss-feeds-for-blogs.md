---
title: RSS Feeds for Your Blog
date: 2024-12-28
tags:
  - rss
  - feed
  - readers
category: Development
---

# RSS Feeds for Your Blog

RSS (or Atom) lets people follow your blog in feed readers without visiting the site every day.

## Why offer a feed?

- Readers can subscribe once and get new posts in their app.
- No algorithm – they see everything you publish.
- Works with automation (e.g. IFTTT, newsletters).

## Generating a feed

With Eleventy, use `@11ty/eleventy-plugin-rss`. It provides filters and a virtual template option: point it at your posts collection and get an XML feed at e.g. `/feed/feed.xml`.

Add a `<link rel="alternate" type="application/atom+xml" href="/feed/feed.xml">` in your `<head>` so readers can discover the feed. Small effort, big payoff for feed users.
