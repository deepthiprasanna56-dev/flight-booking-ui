# SkyVoyage — Flight Booking Platform

A responsive, interactive flight booking demo built with React, Vite, Tailwind CSS 4, Framer Motion, and Lucide React. Flight and payment data are local mock data. Checkout is a demo and does not process payment information.

## Run locally

In the VS Code terminal, open this folder and run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). To create and preview a production build, run `npm run build` and then `npm run preview`.

## Main project structure

```text
src/
  data/flights.js     Airport and mock flight data
  components/ui/      Reusable TypeScript UI components
  lib/utils.ts        Shared className helper (cn)
  App.jsx             Search, results, booking flow, and reusable UI
  index.css           Responsive visual system and component styles
  main.jsx            React entry point
vite.config.js        Vite, React, and Tailwind plugins
components.json       shadcn/ui aliases and component settings
tsconfig.json         TypeScript and @/* alias configuration
```

Search, filtering, sorting, flight details, passenger validation, seat selection, demo payment, and booking confirmation are connected through shared React state.

## UI component setup

This app uses Vite with Tailwind CSS 4 (configured in `vite.config.js` and `src/index.css`), and has TypeScript enabled for `.tsx` UI components. It uses the conventional shadcn component location at `src/components/ui` because application source lives under `src/`. Keeping shared primitives there gives shadcn CLI-generated components and app imports one predictable location. The `@/` alias resolves to `src/`, and `src/lib/utils.ts` provides the `cn()` helper.

The shadcn project metadata is already set up in `components.json`. To add another shadcn component, use the CLI from this folder, for example:

```bash
npx shadcn@latest add button
```

For a new Vite project, initialize shadcn with `npx shadcn@latest init -t vite`, choose TypeScript, and use `src/components/ui` when prompted. This project already has that structure and configuration, so reinitializing is unnecessary.

The reusable additions are `flight-card-1.tsx`, `flight-status-card.tsx`, `interactive-icon-cloud.tsx`, `auth-ui.tsx`, and its `typewriter.tsx` dependency. The auth UI is a frontend demo: form submits show local success feedback, while production authentication requires a real identity provider.
