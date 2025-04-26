# Delve Compliance Platform

## How to run this project locally?

### 1. Set up the Delve Supabase Project

This is different from the customer's supabase accounts we are going to test.  
It is used to store customer Supabase connections (access tokens).

- Create a Supabase organization and project.
- Go to `SQL Editor` and run the SQL in `supabase/migrations/*.sql`. This will:
  - Create the `user_supabase_connections` table to store customers' access keys.
  - Create Row Level Security (RLS) policies so that each user can securely access only their own Supabase accounts.
  - _(Note: Ideally, we would run SQL using `supabase migration up`, but that requires additional setup and is out of scope for this POC.)_
- Go to `Project Settings` > `Data API`.
- Note down the **Project URL** and **Project API Anon Key** (needed in Step 3).

### 2. Register the OAuth Application

- Go to [Supabase Org Settings](https://supabase.com/dashboard/org/_/apps).
- Select the organization created in Step 1 and navigate to **OAuth Apps**.
- Click **Add application**:
  - Provide a name for the application (e.g., `Delve Compliance`) — this will appear on the OAuth consent screen for customers.
  - Set **Website URL** to `http://localhost:3000`.
  - Set **Authorization callback URL** to `http://localhost:3000/protected/connect/callback`.
  - Select the following permissions:
    - **Auth**: Read (for MFA check)
    - **Database**: Read, Write (for RLS check)
    - **Organizations**: Read (for Dashboard view)
    - **Projects**: Read (for PITR check)
    - **Secrets**: Read (for RLS and MFA checks)
  - Click **Confirm**.
- Note down the **Client ID** and **Client Secret** (needed in Step 3).

### 3. Configure Environment Variables

Create a `.env.local` file and add the following:

```bash
# Output from Step 1 (Delve Supabase Project)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Output from Step 2 (OAuth Application)
SUPABASE_AUTH_CLIENT_ID=your_client_id
SUPABASE_AUTH_CLIENT_SECRET=your_client_secret

# Application's public URL (for OAuth redirect)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm install
npm run dev
open http://localhost:3000
```

## How to deploy this project?

- Replace `http://localhost:3000` with your production URL (e.g., `https://your-domain.com`) in **Steps 2 & 3**.
- Then follow the rest of the steps exactly the same.

## Usage

1. Users sign in to the Delve Compliance app with regular authentication.
2. Click **Connect Supabase Project**.
3. Authorize access to their Supabase project.
4. Select a project and run compliance checks.

## Security Notes

- OAuth tokens are stored securely with Row Level Security (RLS) enforced.
- Each user can access **only** their own connection data.
- **State parameters** are used in OAuth to prevent CSRF attacks.
- All sensitive operations require user authentication.

## Pending

- [ ] Implement automatic refresh of access tokens using the refresh token.
      _(Currently, the connection is deleted after token expiry — user needs to authorize again after ~24 hours.)_
