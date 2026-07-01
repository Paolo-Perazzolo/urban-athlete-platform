# Urban Athlete Platform - App

Modern web platform for outdoor calisthenics athletes in Trieste and Milan.

## 🚀 Quick Start (From Home Network)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env
# Then edit .env and add your Supabase keys

# 3. Run dev server
npm run dev
# Opens at http://localhost:5173

# 4. Build for production
npm run build
npm run preview
```

## 📁 Project Structure

```
app/
├── src/
│   ├── lib/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── atoms/           # Button, Card, Input
│   │   │   ├── molecules/       # SearchBar, SpotCard
│   │   │   ├── organisms/       # Navigation, Footer
│   │   │   └── layout/          # Page layouts
│   │   ├── content/             # JSON content files
│   │   │   └── home.json        # ← EDIT TEXT HERE
│   │   ├── stores/              # Global state
│   │   └── utils/               # Helper functions
│   │       └── supabase.js      # Database client
│   ├── routes/                  # Pages (file-based routing)
│   │   ├── +layout.svelte       # Root layout
│   │   ├── +page.svelte         # Home page
│   │   └── spots/               # Spots section
│   ├── app.html                 # HTML shell
│   └── app.css                  # Global styles
├── static/                      # Static assets (images, fonts)
├── supabase/
│   └── migrations/              # Database schema
│       └── 001_initial_schema.sql
└── package.json                 # Dependencies
```

## ✏️ How to Edit Content

All text and images are in JSON files at `src/lib/content/`.

**Example: Edit home page**
1. Open `src/lib/content/home.json`
2. Change the text:
   ```json
   {
     "hero": {
       "title": "Your New Title Here"
     }
   }
   ```
3. Save - the page auto-reloads!

## 🎨 Design System

Colors, fonts, and spacing are in `tailwind.config.js`.

**Change primary color:**
```js
colors: {
  primary: {
    500: '#1890ff', // ← Change this
  }
}
```

## 🗄️ Database Setup

1. Go to your Supabase project: https://supabase.com/dashboard/project/uidvrhthkeqxwytangnt
2. Click **SQL Editor**
3. Copy/paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run**

This creates all tables: profiles, spots, reviews, exercises, etc.

## 🚢 Deploy to Vercel

1. Push code to GitHub (already done!)
2. Go to https://vercel.com/new
3. Import your repo: `Paolo-Perazzolo/urban-athlete-platform`
4. Set project root to `app/`
5. Add environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Use the same Supabase `main` project values for Preview/Development and Production
7. Click **Deploy**

Done! Your app is live in ~2 minutes.

## 📚 Learn More

- **SvelteKit Docs**: https://kit.svelte.dev/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Supabase Docs**: https://supabase.com/docs

## 🐛 Troubleshooting

**"Cannot find package" errors**
- Run `npm install` from home network (corporate firewall blocks npm)

**"VITE_SUPABASE_URL is undefined"**
- Create `.env` file with your Supabase credentials

**Page is blank**
- Check browser console for errors (F12)
- Make sure dev server is running (`npm run dev`)

## 📝 Next Steps

- [ ] Install dependencies from home
- [ ] Run database migration in Supabase
- [ ] Test locally
- [ ] Deploy to Vercel
- [ ] Add more pages (spots list, auth, profile)
