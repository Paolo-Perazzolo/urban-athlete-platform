# Setup Instructions

## Current Project State

✅ **Configuration files:**
- `package.json` - Dependencies (SvelteKit, Tailwind, Supabase)
- `svelte.config.js` - SvelteKit config (Vercel adapter)
- `tailwind.config.js` - Design system (colors, fonts, spacing)
- `vite.config.js` - Build tool config
- `postcss.config.js` - CSS processing

✅ **App features shipped:**
- Supabase authentication (login/signup)
- Profile page integration
- Spots page placeholder
- Deterministic training plan generation flow

✅ **UI redesign:**
- Global dark minimal theme (`src/app.css`)
- Restyled navigation and key pages
- Premium landing page composition in `src/routes/+page.svelte`

✅ **Documentation:**
- `PROJECT_STRUCTURE.md` - Full folder organization explained
- This file - setup instructions

✅ **Image assets:**
- `static/images/` folder is active
- Current landing uses `static/images/image1.webp` and `static/images/image2.webp`

## Local Setup

1. **Install dependencies** (from `app`):
   ```bash
   npm install
   ```

2. **Run the dev server**:
   ```bash
   npm run dev
   ```
   Opens at http://localhost:5173

3. **Build check**:
   ```bash
   npm run build
   ```

Note: On Windows + OneDrive, Vercel adapter symlink creation may fail (`EPERM`) during final adapter step even when app bundles compile successfully.

## How to Edit Content

Landing text is in `src/lib/content/home.json`. Edit JSON and save - the page auto-updates.

**Example:**
```json
{
  "hero": {
    "title": "Your New Title Here",
    "subtitle": "Your new subtitle"
  }
}
```

Landing visual blocks currently use fixed image paths in `src/routes/+page.svelte`:
- `/images/image1.webp`
- `/images/image2.webp`

## Project Structure (Simplified)

```
app/
├── src/
│   ├── lib/
│   │   ├── components/     ← Reusable UI pieces
│   │   └── content/        ← TEXT & IMAGES (edit here!)
│   └── routes/             ← Pages of your website
├── static/
│   └── images/             ← Homepage and UI image assets
└── package.json            ← Dependencies
```
