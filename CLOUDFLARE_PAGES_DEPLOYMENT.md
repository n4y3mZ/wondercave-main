# Deploying WonderCave to Cloudflare Pages (Free Version)

This application has been engineered to work 100% seamlessly on **Cloudflare Pages / Workers Free Version** as a high-performance Single Page Application (SPA) with client-side Google Firebase Authentication and Firestore synchronization.

---

## Architecture Summary for Cloudflare Free Tier

1. **Static SPA Build (`dist`)**:
   - Built with Vite + React 19 + Tailwind CSS.
   - Run `npm run build` to generate the production `dist/` directory.
2. **SPA Routing Rewrite (`public/_redirects`)**:
   - `/*    /index.html   200` is pre-configured in `public/_redirects`.
   - Ensures deep link routing (e.g., `/topics/sql-injection`, `/login`, `/dashboard`) works without 404 errors on Cloudflare Pages.
3. **Google Firebase Authentication & Firestore**:
   - Operates 100% client-side directly against Google's global Firebase infrastructure.
   - No custom backend server is required for login, signup, user profiles, or content loading.
4. **Embedded Knowledge Base Fallback (`src/data/fallbackPages.ts`)**:
   - All 400+ word deep-dive posts, code examples, case studies, and inline images are bundled into the client build for instant, zero-latency loading on the Cloudflare edge.

---

## Method 1: Deploy via Cloudflare Dashboard (GitHub Integration)

1. Push your repository to **GitHub** or **GitLab**.
2. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** &rarr; **Create application** &rarr; **Pages** &rarr; **Connect to Git**.
3. Select your repository.
4. Configure the build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `20` or higher (add environment variable `NODE_VERSION: 20`)
5. Click **Save and Deploy**. Your site will be live at `https://<your-project>.pages.dev` within 60 seconds!

---

## Method 2: Direct Upload via Wrangler CLI (Instant Free Deploy)

If you don't use Git or want to deploy directly from your local terminal:

\`\`\`bash
# 1. Build the production bundle
npm run build

# 2. Deploy directly to Cloudflare Pages free tier
npx wrangler pages deploy dist --project-name WonderCave
\`\`\`

---

## Authorizing your Cloudflare Domain in Firebase Console

To ensure Google Sign-In popups work on your live Cloudflare Pages URL:

1. Go to the [Firebase Console](https://console.firebase.google.com/project/gen-lang-client-0508062409/authentication/settings).
2. Under **Authentication** &rarr; **Settings** &rarr; **Authorized domains**, click **Add domain**.
3. Add your Cloudflare Pages domain (e.g. `<your-project>.pages.dev` or custom domain `wondercave.nayem.net`).
4. Done! Google login and Firebase signup will authenticate seamlessly.
