# Delve Compliance Platform

## How to run this project locally?

### Setting up Supabase OAuth Integration

This guide explains how to set up the OAuth integration that allows users to connect their Supabase projects to your compliance app.

#### Prerequisites

- A Supabase project for your compliance app (this is where users will log in and where you'll store connection data)
- Access to the [Supabase Dashboard](https://app.supabase.com)

#### 1. Register OAuth Application

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/org/_/apps)
2. Navigate to "Settings" > "OAuth Applications"
3. Click "Add application" and create one
4. Note down the following credentials:
   ```
   SUPABASE_AUTH_CLIENT_ID=your_client_id
   SUPABASE_AUTH_CLIENT_SECRET=your_client_secret
   ```

#### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Your compliance app's Supabase project
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# OAuth application credentials
SUPABASE_AUTH_CLIENT_ID=your_client_id
SUPABASE_AUTH_CLIENT_SECRET=your_client_secret

# Your application's public URL (required for OAuth redirect)
NEXT_PUBLIC_SITE_URL=http://localhost:3000 # In development
# NEXT_PUBLIC_SITE_URL=https://your-domain.com # In production
```

#### 3. Set up the Database

Run the migration to create the required table:

```bash
supabase migration up
```

If you want to skip the hassle of setting up `supabase` cli, you can also execute SQL from `supabase/migrations/*.sql` manually in supabase dashboard.

This will create:

- `user_supabase_connections` table for storing OAuth tokens
- Row Level Security policies
- Necessary indexes and triggers

#### 4. Configure OAuth Redirect URLs

In the Supabase Dashboard, add the following redirect URLs:

- Development: `http://localhost:3000/protected/connect/callback`
- Production: `https://your-domain.com/protected/connect/callback`

Make sure these URLs match your `NEXT_PUBLIC_SITE_URL` environment variable.

### Run locally

```bash
npm install
npm run dev
open http://localhost:3000
```

## Usage

1. Users sign in to your compliance app using regular authentication
2. Click "Connect Supabase Project"
3. Authorize access to their Supabase project
4. Manage connected projects from the same page

## Security Notes

- OAuth tokens are stored in a secure table with Row Level Security
- Each user can only access their own connection data
- State parameters are used to prevent CSRF attacks
- Access tokens are automatically refreshed when expired
- All sensitive operations require authentication
