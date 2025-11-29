# PrivacyGuard - PII Risk Assessment & Digital Privacy Protection

A modern web application for scanning and assessing personal information (PII) risks across the internet.

## Technologies

This project is built with:

- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Component library
- **Tailwind CSS** - Styling
- **Supabase** - Backend database and authentication
- **React Router** - Client-side routing

## Local Development

### Prerequisites

- Node.js (v18 or higher) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn

### Setup

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd privacy-data-finder

# Install dependencies
npm install

# Create environment file (optional - app works with hardcoded values)
# Copy the example and fill in your values:
# cp .env.example .env

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Environment Variables

Create a `.env` file in the root directory (optional - the app has fallback values):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://nozkxrartxphvlznpwhk.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Backend API Configuration
VITE_API_BASE_URL=http://127.0.0.1:5000
```

## Deployment

This project can be deployed to any static hosting platform. Configuration files are included for:

- **Vercel** (recommended) - `vercel.json`
- **Netlify** - `netlify.toml`
- **Cloudflare Pages** - `public/_redirects`

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub** (if not already done)

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables:**
   - In Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     - `VITE_SUPABASE_URL` - Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key
     - `VITE_API_BASE_URL` - Your backend API URL (production)

4. **Deploy:**
   - Vercel will automatically detect the Vite configuration
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

5. **Update Supabase CORS (if needed):**
   - Go to your Supabase project dashboard
   - Settings → API → Add your Vercel domain to allowed origins

### Deploy to Netlify

1. **Push your code to GitHub**

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your repository

3. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Netlify will auto-detect from `netlify.toml`

4. **Add Environment Variables:**
   - Site settings → Environment variables
   - Add: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`

5. **Deploy:**
   - Click "Deploy site"
   - Your site will be live at `https://your-project.netlify.app`

### Deploy to Cloudflare Pages

1. **Push your code to GitHub**

2. **Connect to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Pages → Create a project
   - Connect your GitHub repository

3. **Configure Build Settings:**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (leave as default)

4. **Add Environment Variables:**
   - Settings → Environment variables
   - Add: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`

5. **Deploy:**
   - Click "Save and Deploy"
   - Your site will be live at `https://your-project.pages.dev`

## Supabase Configuration

**Important:** Supabase is completely independent of your hosting platform. Your existing Supabase project will continue to work without any changes.

- **Database:** Already configured and working
- **Authentication:** Already configured and working
- **Edge Functions:** Already deployed to Supabase (independent of frontend host)

After deploying, you may need to:
- Update CORS settings in Supabase dashboard to allow your new domain
- Verify authentication redirect URLs in Supabase Auth settings

## Build

To build for production:

```sh
npm run build
```

The production build will be in the `dist/` directory.

## Project Structure

```
src/
├── components/     # React components
├── contexts/       # React contexts (Auth, Results, etc.)
├── hooks/          # Custom React hooks
├── integrations/   # Supabase client configuration
├── lib/            # Utilities and API functions
├── pages/          # Page components
└── types/          # TypeScript type definitions
```

## Support

For issues or questions, please open an issue on GitHub.
