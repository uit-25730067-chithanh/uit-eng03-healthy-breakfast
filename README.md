# UIT English 03 Presentation - Slide Deck

An interactive, high-end Vue 3 presentation hostable on Vercel.
**Topic**: The Power of Breakfast: Why Students Should Never Skip It.

## 🌟 Key Features

- **Dynamic Slide Engine**: Declarative slide configurations out of the box.
- **Progressive Reveal**: Advanced, step-by-step element rendering for complex concepts.
- **Custom Visual Components**: Specialized components like `BatteryProgress`, `GlitchEffect`, and `SimpleCharts` for data storytelling.
- **Glassmorphism Design**: High-end translucent interface combining Tailwind CSS 4 capabilities.
- **Presenter Mode**: Built-in sidebar with presenter scripts and instant slide navigation.

## 🏗️ Project Structure

```text
├── public/assets/       # Static static images for slides
├── src/
│   ├── components/      # Common UI like PremiumImage, Slide layouts
│   ├── data/
│   │   └── slides.ts    # 📝 THE SINGLE SOURCE OF TRUTH for all slides
│   ├── index.css        # Tailwind directives and theme tokens
│   ├── App.vue          # The main Slide Engine and layout
│   └── main.ts          # Vue application entry point
└── AGENTS.md / CLAUDE.md # AI/Cursor context instructions
```

## 👩‍💻 How to Contribute & Add Slides

To modify or add a slide, you only need to edit `src/data/slides.ts`:

1. Open `src/data/slides.ts`.
2. Add a new block to the `rawSlides` array adhering to the `SlideData` interface.
3. Place any related background images in `public/assets/images/slides/{slide-id}.jpg`.

## 🚀 Run Locally

**Prerequisites:** Node.js, `pnpm`

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run the dev server:

   ```bash
   pnpm dev
   ```

3. Build for production:

   ```bash
   pnpm build
   ```

## ⌨️ Presentation Shortcuts

- **Enter / Exit Fullscreen**: `Cmd + P` (Mac) or `Ctrl + P` (Windows)
- **Exit Fullscreen**: `ESC`
- **Next Slide/Step**: `Space`, `Enter`, `Right Arrow`

- **Enter / Exit Fullscreen**: `Cmd + P` (Mac) or `Ctrl + P` (Windows)
- **Exit Fullscreen**: `ESC`
- **Next Slide/Step**: `Space`, `Enter`, `Right Arrow`
- **Previous Slide/Step**: `Left Arrow`

---

_Maintained under strict code-quality guidelines. Pls check `.gitignore` & AI `.md` context files before making complex changes._
- **Exit Fullscreen**: `ESC`
- **Next Slide/Step**: `Space`, `Enter`, `Right Arrow`
- **Previous Slide/Step**: `Left Arrow`

---
_Maintained under strict code-quality guidelines. Pls check `.gitignore` & AI `.md` context files before making complex changes._
