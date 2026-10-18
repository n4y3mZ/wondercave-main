# Theme Information & Styling Guidelines

## Overview
This document contains the core theme details mirrored from the user's reference site (PortSwigger).

## Core Colors
Our CSS variables map directly to Tailwind classes, but we've overridden the hex codes in `src/index.css` to match the target reference exactly. 

**Color Palette:**
- **Primary:** `#FF5A36` (Bright Orange) - mapped to `--color-brand-primary` / `bg-brand-primary`
- **Secondary:** `#111A4D` (Deep Navy) - mapped to `--color-action-iris` / `bg-action-iris` 
- **Tertiary/Light Background:** `#F4F6FB` - mapped to `--color-bg-peach` / `bg-bg-peach`
- **Dark Text:** `#050812` (Onyx) - mapped to `--color-text-onyx` / `text-text-onyx`
- **Field/Muted Background:** `#E6EAF1` - mapped to `--color-bg-field` / `bg-bg-field`

## Element Styling
- **Buttons in Hero/Primary actions:** Increased border-radius to `rounded-full` (pill shape).
- **Opacity Modifiers:** Use standard Tailwind opacity modifiers on the custom properties for transparent effects (e.g. `bg-brand-primary/90`, `text-action-iris/70`).

## Typography
Fonts used across the application:
- **Heading / Body:** Inter (sans-serif)
- **Monospace:** IBM Plex Mono 

## Icons & Logo
- We use a custom SVG logo element wherever needed to match the brand identity alongside bold font weighting.

*Note for future agents: Do not change the text content of the website. Maintain the layout patterns but enforce these styling rules heavily.*
