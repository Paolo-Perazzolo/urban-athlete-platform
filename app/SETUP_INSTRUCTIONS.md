# Setup Instructions

## What I've Created So Far

✅ **Configuration files:**
- `package.json` - Dependencies (SvelteKit, Tailwind, Supabase)
- `svelte.config.js` - SvelteKit config (Vercel adapter)
- `tailwind.config.js` - Design system (colors, fonts, spacing)
- `vite.config.js` - Build tool config
- `postcss.config.js` - CSS processing

✅ **Base styles:**
- `src/app.css` - Global styles with Tailwind
- Custom colors inspired by Revolut & Freeletics
- Reusable component classes (card, btn, input)

✅ **Content system:**
- `src/lib/content/home.json` - Landing page content (easy to edit!)
- JSON structure for all text and images

✅ **Documentation:**
- `PROJECT_STRUCTURE.md` - Full folder organization explained
- This file - setup instructions

## Next Steps to Complete Sprint 0

1. **Install dependencies** (run this in the `app` folder):
   ```bash
   cd app
   npm install
   ```

2. **Create remaining files** (I'll do this):
   - Layout component (`src/routes/+layout.svelte`)
   - Home page (`src/routes/+page.svelte`)
   - Atomic components (Button, Card, etc.)
   - Supabase client setup

3. **Run the dev server**:
   ```bash
   npm run dev
   ```
   Opens at http://localhost:5173

4. **Deploy to Vercel** (after it works locally)

## How to Edit Content

All text is in `src/lib/content/home.json`. Just edit the JSON and save - the page auto-updates!

**Example:**
```json
{
  "hero": {
    "title": "Your New Title Here",
    "subtitle": "Your new subtitle"
  }
}
```

## Project Structure (Simplified)

```
app/
├── src/
│   ├── lib/
│   │   ├── components/     ← Reusable UI pieces
│   │   └── content/        ← TEXT & IMAGES (edit here!)
│   └── routes/             ← Pages of your website
├── static/                 ← Images, fonts, etc.
└── package.json            ← Dependencies
```

## Ready to Continue?

Say "continue" and I'll create the remaining components and pages!
