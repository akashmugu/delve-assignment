# Delve (codename)

## Use Case

- A customer using Delve needs to check whether their [Supabase](https://supabase.com) configuration is set up properly for compliance.

## Goal

- Build a full-stack application that fulfills the real world scenario
  - Next.js UI (as nice as you can, time permitting)
  - Node.js backend

## Features

- Authenticate with Supabase
  - Basically means getting customer credentials to run scans on a particular account.
- Run the following checks
  - Is MFA enabled for each user?
    - List users, determine if they are passing or failing.
  - Is Row Level Security (RLS) enabled for all tables?
    - List, then determine status
  - Is Point in Time Recovery (PITR) enabled for all projects?
    - List, then determine status
- Collect evidence
  - Log the evidence collected on passing or failing status with timestamps, along with logs for any changes made or suggested

## Bonus

- Provide options to automatically fix the problem
  - Auto-run commands that can resolve the issue
  - AI chat to solve the problem (perhaps perplexity/claude/openai)
- Feel free to implement any additional features, improvements, or other ideas you may have.

## Commonly asked questions

- For the "Collect evidence" feature, should I create a UI to display the logs, or do you have a specific way you'd like this handled?
  - 100%. It's good to display a UI for the logs, and can take creative liberties on that.
