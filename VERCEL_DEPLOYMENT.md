# Deploy PrivacyGuard to Vercel - Step by Step Guide

This guide will walk you through deploying your PrivacyGuard application to Vercel.

## Prerequisites

- ✅ Your code is ready (Lovable dependencies removed)
- ✅ Build tested locally (`npm run build` works)
- ✅ GitHub repository (public or private)

## Step 1: Push Code to GitHub

If your code isn't already on GitHub:

```bash
# Initialize git if needed
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Vercel deployment"

# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/your-repo.git

# Push to GitHub
git push -u origin main
```

## Step 2: Sign Up / Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (recommended - easiest integration)
4. Authorize Vercel to access your GitHub account

## Step 3: Import Your Project

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find and click **"Import"** next to your `privacy-data-finder` repository
4. Vercel will auto-detect:
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build` (from `vercel.json`)
   - **Output Directory:** `dist` (from `vercel.json`)
   - **Install Command:** `npm install` (default)

## Step 4: Configure Environment Variables

**IMPORTANT:** Before deploying, add your environment variables:

1. In the project import screen, scroll down to **"Environment Variables"**
2. Click **"Add"** and add each variable:

   ### Variable 1: Supabase URL
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** `https://nozkxrartxphvlznpwhk.supabase.co`
   - **Environment:** Select all (Production, Preview, Development)

   ### Variable 2: Supabase Anon Key
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vemt4cmFydHhwaHZsem5wd2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0ODM1OTQsImV4cCI6MjA3MTA1OTU5NH0.eLBjHHMrFlvD3HxSA058VO2C0Y1cWBUETHql96wD3XA`
   - **Environment:** Select all (Production, Preview, Development)

   ### Variable 3: Backend API URL
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://your-backend-api-url.com` ⚠️ **UPDATE THIS!**
   - **Environment:** Select all (Production, Preview, Development)
   - **Note:** Replace with your actual production backend API URL

3. Click **"Deploy"** button

## Step 5: Wait for Deployment

1. Vercel will:
   - Install dependencies (`npm install`)
   - Build your project (`npm run build`)
   - Deploy to their CDN

2. You'll see the build logs in real-time
3. Build typically takes 1-3 minutes

## Step 6: Your Site is Live! 🎉

Once deployment completes:
- Your site will be live at: `https://your-project-name.vercel.app`
- Vercel automatically provides a unique URL
- You can find it in the deployment page

## Step 7: Update Supabase CORS Settings

After deployment, update Supabase to allow your new Vercel domain:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Scroll to **"CORS"** section
5. Add your Vercel URL to **"Additional Allowed Origins"**:
   - Example: `https://your-project-name.vercel.app`
   - Or use wildcard: `https://*.vercel.app` (allows all Vercel previews)
6. Click **"Save"**

## Step 8: Update Supabase Auth Redirect URLs (if using OAuth)

If you use OAuth (Google, GitHub, etc.):

1. In Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add to **"Redirect URLs"**:
   - `https://your-project-name.vercel.app/**`
   - `https://your-project-name.vercel.app`
3. Click **"Save"**

## Step 9: Test Your Deployment

Test these features:

- [ ] Homepage loads correctly
- [ ] Sign up / Login works
- [ ] Database operations work (Supabase)
- [ ] API calls to backend work
- [ ] All routes work (no 404 errors)
- [ ] Mobile responsive design works

## Step 10: Custom Domain (Optional)

To use your own domain:

1. In Vercel project → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `privacyguard.com`)
4. Follow Vercel's DNS configuration instructions
5. Update Supabase CORS with your custom domain

## Managing Environment Variables Later

To update environment variables after deployment:

1. Go to your project in Vercel
2. **Settings** → **Environment Variables**
3. Add, edit, or remove variables
4. **Redeploy** for changes to take effect (Vercel will prompt you)

## Automatic Deployments

Vercel automatically deploys:
- **Production:** Every push to `main` branch
- **Preview:** Every push to other branches or pull requests

Each deployment gets a unique URL you can share.

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18+ by default)

### Environment Variables Not Working

- Make sure variables start with `VITE_`
- Redeploy after adding variables
- Check that variables are set for correct environment

### Supabase Connection Issues

- Verify Supabase URL and key are correct
- Check CORS settings in Supabase dashboard
- Check browser console for specific errors

### Routes Return 404

- Verify `vercel.json` exists with correct rewrites
- All routes should redirect to `/index.html`

### API Calls Failing

- Verify `VITE_API_BASE_URL` is set correctly
- Check backend API CORS settings
- Ensure backend is accessible from internet

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Discord Community](https://vercel.com/discord)
- Check deployment logs in Vercel dashboard

## Quick Reference

**Your Vercel Project URL:** `https://your-project-name.vercel.app`

**Environment Variables Needed:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL`

**Files Already Configured:**
- ✅ `vercel.json` - Routing and build config
- ✅ `vite.config.ts` - Build configuration
- ✅ Supabase client - Ready to use

You're all set! 🚀

