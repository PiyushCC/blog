---
title: GitHub Discussions as Blog Comments
date: 2024-12-15
tags:
  - giscus
  - github
  - comments
category: Development
---

# GitHub Discussions as Blog Comments

Giscus (and similar tools) turn GitHub Discussions into comment sections on static pages.

## How it works

You add a script tag to your post layout. It uses the page URL (or slug) to find or create a discussion thread in your repo. Logged-in GitHub users can comment; everything stays in GitHub.

## Setup

1. Enable Discussions on your repository.
2. Install the Giscus app and pick a category for blog comments.
3. Get your repo ID and category ID from the Giscus config page.
4. Put those in your site config and include the script in the layout.

No database, no moderation backend – just GitHub. Spam is less of an issue because commenting requires a GitHub account.
