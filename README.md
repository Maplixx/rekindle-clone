# ReKindle clone

A faithful, local-first React/Vite recreation of the public ReKindle e-ink dashboard.

## Included

- Dense monochrome dashboard shell with the original catalog structure.
- 58 application entries and 48 game entries.
- Local SVG iconography for every catalog tile, based on the original public icon set.
- Search, category filters, edit/hide mode, local notes/tasks/journal and playable browser games.
- Responsive desktop/mobile layout and deep-link routes such as `/app/notes` and `/game/2048`.

## Run locally

```bash
npm install
npm run dev
```

The production build is generated with `npm run build`.

## Scope note

Provider-backed PLUS services remain clearly marked as previews. They require their own credentials and integrations and are not represented as connected in this clone.
