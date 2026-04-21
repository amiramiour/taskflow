# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`taskflow` is a Node.js ESM project (no bundler, no framework) that acts as a backend/scripting client for a Supabase-powered task management app. All files run directly with `node`.

## Commands

```bash
# Run any script
node alice-watch.js
PROJECT_ID=<uuid> node alice-watch.js

# Run both test scripts (two terminals)
PROJECT_ID=<uuid> node alice-watch.js   # Terminal 1 — listens for realtime events
PROJECT_ID=<uuid> node bob-actions.js   # Terminal 2 — creates task, updates status, adds comment

# Quick admin check
node test-rls.js
```

There is no build step, no lint config, and no test runner configured.

## Architecture

All modules are ESM (`"type": "module"` in package.json). Import chain:

```
client.js          ← base: exports supabase (anon) and supabaseAdmin (service_role)
auth.js            ← signUp / signIn / signOut, uses supabase
tasks.js           ← task CRUD + comments, uses supabase
realtime.js        ← Supabase Realtime subscriptions (postgres_changes + presence)
upload.js          ← Uploadthing router + UploadButton export
alice-watch.js     ← test script: connects as alice, subscribes to realtime
bob-actions.js     ← test script: connects as bob, mutates data to trigger alice
```

## Supabase schema

Six tables: `profiles`, `projects`, `project_members`, `tasks`, `comments`, `notifications`. RLS is enabled on all tables.

Key foreign key aliases used in queries:
- `profiles!tasks_assigned_to_fkey` → `assigned_profile`
- `profiles!tasks_created_by_fkey` → `creator`

`supabase` (anon key) respects RLS — used for all user-facing operations. `supabaseAdmin` (service_role) bypasses RLS — only for admin/backend scripts.

## Environment variables

| Variable | Used by |
|---|---|
| `SUPABASE_URL` | client.js |
| `SUPABASE_ANON_KEY` | client.js |
| `SUPABASE_SERVICE_KEY` | client.js (supabaseAdmin) |
| `UPLOADTHING_SECRET` | upload.js |
| `UPLOADTHING_TOKEN` | upload.js |
| `PROJECT_ID` | alice-watch.js, bob-actions.js |

`dotenv/config` is imported at the top of entry-point scripts; service modules rely on it being loaded by the caller.

## Uploadthing

`upload.js` exports `uploadRouter` (two routes: `imageUploader` 4MB, `pdfUploader` 8MB) and `UploadButton` (React component, for future frontend use). The middleware authenticates via `Authorization: Bearer <token>` header checked against Supabase.
