---
title: CSS Variables and Dark Mode
date: 2025-02-10
tags:
  - css
  - design
  - dark-mode
category: Frontend
---

# CSS Variables and Dark Mode

Using CSS custom properties (variables) makes theming and dark mode straightforward.

## Define your palette

```css
:root {
  --bg: #f8f9fa;
  --text: #1a1a2e;
  --accent: #0d6efd;
}

[data-theme="dark"] {
  --bg: #1a1a2e;
  --text: #eaeaea;
  --accent: #6ea8fe;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

## Toggle with JavaScript

Store the user's choice in `localStorage` and set a attribute or class on the root element. All components using `var(--bg)` and friends update automatically.

No duplicate styles, no flash – just one set of variables and two (or more) themes.
