# Project Structure — Urban Athlete Platform

## Folder Organization

```
app/
├── src/
│   ├── lib/
│   │   ├── components/          # Atomic design components
│   │   │   ├── atoms/           # Smallest building blocks (Button, Input, Icon)
│   │   │   ├── molecules/       # Simple combinations (SearchBar, Card, Badge)
│   │   │   ├── organisms/       # Complex components (Nav, SpotCard, LeaderboardRow)
│   │   │   └── layout/          # Layout components (Header, Footer, Container)
│   │   ├── content/             # Content files (JSON)
│   │   │   ├── home.json        # Landing page content
│   │   │   ├── spots.json       # Spots page content
│   │   │   └── about.json       # About page content
│   │   ├── stores/              # Svelte stores (global state)
│   │   │   ├── auth.js          # Authentication state
│   │   │   └── user.js          # User profile state
│   │   └── utils/               # Utility functions
│   │       ├── supabase.js      # Supabase client
│   │       └── helpers.js       # Helper functions
│   ├── routes/                  # Pages (file-based routing)
│   │   ├── +layout.svelte       # Root layout (wraps all pages)
│   │   ├── +page.svelte         # Home page (/)
│   │   ├── spots/               # Spots section
│   │   │   ├── +page.svelte     # Spots list (/spots)
│   │   │   └── [id]/            # Individual spot
│   │   │       └── +page.svelte # Spot detail (/spots/123)
│   │   ├── auth/                # Authentication pages
│   │   │   ├── login/
│   │   │   └── signup/
│   │   └── profile/             # User profile
│   │       └── +page.svelte
│   ├── app.html                 # HTML shell
│   └── app.css                  # Global styles (Tailwind)
├── static/                      # Static assets
│   ├── images/                  # Images
│   └── favicon.png              # Favicon
├── package.json                 # Dependencies
├── svelte.config.js             # SvelteKit config
├── tailwind.config.js           # Tailwind config
└── vite.config.js               # Vite config
```

## How to Update Content

### 1. Text Content
Edit JSON files in `src/lib/content/`:

**Example: `home.json`**
```json
{
  "hero": {
    "title": "Find Your Spot",
    "subtitle": "Discover the best outdoor training spots in your city",
    "cta": "Get Started"
  },
  "features": [
    {
      "title": "Spot Finder",
      "description": "Find pull-up bars, parallel bars, and more",
      "icon": "map"
    }
  ]
}
```

### 2. Images
Place images in `static/images/` and reference them in JSON:
```json
{
  "hero": {
    "image": "/images/hero-athlete.jpg"
  }
}
```

### 3. Styling
- Colors: Edit `tailwind.config.js` → `theme.extend.colors`
- Fonts: Edit `tailwind.config.js` → `theme.extend.fontFamily`
- Spacing: Edit `tailwind.config.js` → `theme.extend.spacing`

## Atomic Design Explained

### Atoms (smallest pieces)
- Button
- Input
- Icon
- Badge
- Avatar

### Molecules (combinations of atoms)
- SearchBar (Input + Icon)
- Card (Container + Text + Button)
- RatingStars (Icon × 5)

### Organisms (complex components)
- Navigation (Logo + Links + Button)
- SpotCard (Image + Title + Rating + Tags + Button)
- LeaderboardRow (Avatar + Name + XP + Rank)

### Pages (organisms + layout)
- Home (Hero + Features + CTA)
- Spots (SearchBar + SpotCard list + Map)
- Profile (Avatar + Stats + Settings)

## How Components Work

Each component is a `.svelte` file with three sections:

```svelte
<script>
  // JavaScript logic goes here
  // Props (inputs) are defined with 'export let'
  export let title = 'Default Title';
</script>

<!-- HTML template goes here -->
<!-- Use {variables} to insert dynamic content -->
<h1>{title}</h1>

<style>
  /* Component-specific styles (optional) */
  /* Usually we use Tailwind classes instead */
</style>
```

## Next Steps

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Edit content in `src/lib/content/*.json`
4. Components auto-reload when you save
