# Notion Setup Instructions

## Step 1: Revoke Old Token & Get New One

1. Go to https://www.notion.so/my-integrations
2. Click on "Urban Athlete Assistant"
3. Click "Regenerate" or "Show" → "Regenerate" for the Internal Integration Token
4. Copy the NEW token (starts with `secret_...`)

## Step 2: Create `.env` File

Create a file called `.env` in the `my-space` folder:

**Windows (PowerShell):**
```powershell
cd "c:\Users\240200162025\OneDrive - CGM\windsurf-agent\my-space"
New-Item -Path ".env" -ItemType File
notepad .env
```

**Content to paste in `.env`:**
```
# Environment variables - LOCAL ONLY, NOT COMMITTED TO GIT

# Notion Integration
NOTION_TOKEN=secret_YOUR_NEW_TOKEN_HERE
NOTION_PAGE_ID=38a9aa9adc6b80739bc5e7fc092cf1dc
```

Replace `secret_YOUR_NEW_TOKEN_HERE` with your actual new token.

## Step 3: Make Sure Integration is Connected

1. Open your Notion page: https://app.notion.com/p/Calisthenics-startup-poject-38a9aa9adc6b80739bc5e7fc092cf1dc
2. Click the **"..."** menu (top right)
3. Look for **"Connections"** or **"Add connections"**
4. Make sure **"Urban Athlete Assistant"** is connected
5. If not, add it and click "Confirm"

## Step 4: Install Dependencies

```bash
cd "c:\Users\240200162025\OneDrive - CGM\windsurf-agent\my-space"
npm install
```

If npm fails due to network issues, try:
```bash
npm install --registry=https://registry.npmjs.org/
```

## Step 5: Run the Setup Script

```bash
npm run notion:setup
```

This will:
- Create the Backlog database with all properties
- Add 9 Sprint 0 tasks
- Create Decisions Log, Ideas Parking Lot, and Weekly Review pages

## Troubleshooting

**Error: "object_not_found"**
- Make sure you shared the Notion page with the integration (Step 3)
- Double-check the NOTION_PAGE_ID in `.env`

**Error: "unauthorized"**
- Check that NOTION_TOKEN is correct in `.env`
- Make sure there are no extra spaces or quotes

**Network errors with npm**
- Check your internet connection
- Try using a different network
- Check if you're behind a corporate proxy

---

Once this is done, come back and tell me "Notion setup complete" and we can start Sprint 0!
