# CLAUDE.md - Premium Vue + TS Presentation Standards

This file defines the technical and quality standards for the `uit-eng03-healthy-breakfast` project.

## Development Workflows

- **Package Manager**: `pnpm` (REQUIRED)
- **Local Server**: `pnpm dev`
- **Build & Deploy**: `pnpm build` (Target: Vercel)
- **Quality Check**: `pnpm lint` (TypeScript noEmit & ESLint)

## Agent Onboarding & Context Flow

To fully understand and maintain this project, AI Agents MUST prioritize reading these files in order:

1. **`README.md`**: High-level system architecture and local setup guide.
2. **`PROMPT.md`**: Design vision, color palettes, and UI/UX "Golden Rules".
3. **`docs/scripts_and_slides.md`**: Master content specification and slide-by-slide copy.
4. **`src/App.vue`**: The Core Presentation Engine (state navigation, keybindings, reveal logic).
5. **`src/data/slides.ts`**: Structured slide objects mapping content to specific layouts.
6. **`src/data/scripts.ts`**: Teleprompter/Script data mapped by slide ID.

## Architecture Guidelines (Vue 3 + TS)

- **Syntax**: Use `<script setup>` with Composition API.
- **Components**:
  - PascalCase for file names (e.g., `SlideContainer.vue`).
  - Strict props/emits typing using `defineProps` and `defineEmits`.
- **Logic**: Use `composables` for any reusable logic like slide navigation or theme management.
- **Style**: Use Tailwind CSS 4 `@apply` for complex component styles; prefer utility classes for simple layouts.

## Visual Excellence & Design System

- **Theme**: "Healthy Green" Concept.
- **Palette**: Use vibrant, natural greens (`Emerald-500` secondary, `Green-900` text) combined with soft organic backgrounds.
- **Glassmorphism**: Cards MUST have `backdrop-blur-xl`, `bg-white/70`, and thin semi-transparent white borders.
- **Micro-animations**: Every slide transition and interactive element must use `Framer Motion` (Vue Motion) with durations between 150ms-300ms.
- **Typography**: Primary: "Outfit" (Google Fonts), Display: "Syne" or "Poppins".

## Advanced Presentation Engine Patterns

- **Progressive Reveal**: The system automatically computes staggered steps via the `totalSteps` logic in `App.vue` based on slide types (`bullets`, `split`, `component`).
- **Deep Design Tokens**: The `@theme` in `index.css` anchors the brand colors (`--color-brand-primary`, `--color-brand-accent`). Use strict scaling and cubic-bezier transitions.
- **Unified Engine**: `App.vue` is the centralized slide renderer. Avoid routing abstractions (no `vue-router` or `views/` dir).

## Data & Content Rules

- **Copy Source of Truth**: All master textual content is defined in `docs/scripts_and_slides.md`.
- **Slide Implementation**: Layouts, props, and slide structure MUST be managed in `src/data/slides.ts`.
- **Teleprompter Scripts**: Presenter scripts MUST be managed in `src/data/scripts.ts`.
- **Engine Logic**: `src/App.vue` manages the global lifecycle. Do NOT bloat it with slide content.
- **Image Architecture**: All slide background images must reside in `public/assets/images/slides/` and correctly map to their slide `id` (e.g. `tips-1.jpg`).
- **Resilience**: Always rely on `PremiumImage` component for robust lazy loading with shimmer shells and error fallbacks.
- **Localization**: Presentation text and source code are always English.

## Communication

- Agent-to-User communication: Vietnamese.
- Code/Docs/Commit messages: English.
