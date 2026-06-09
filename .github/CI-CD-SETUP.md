# CI/CD Pipeline — Setup Guide

## Overview

```
any branch (not main/master)
        │
        ▼ push
  ┌─────────────────────────┐
  │   staging.yml           │  build + type-check → deploy to Netlify (draft)
  └─────────────────────────┘
        │
        ▼ pull_request → main/master
  ┌─────────────────────────┐
  │   pr-validation.yml     │  type-check + build verify → blocks merge if failed
  └─────────────────────────┘
        │
        ▼ merge into main/master
  ┌─────────────────────────┐
  │   production.yml        │  build → ⏳ WAIT FOR MANUAL APPROVAL
  │   (job: await-approval) │       → deploy to Netlify --prod
  └─────────────────────────┘
```

## File Structure

```
.github/
└── workflows/
    ├── staging.yml          ← auto deploy on any non-main branch
    ├── pr-validation.yml    ← gates PRs targeting main/master
    └── production.yml       ← manual-approval deploy to production

scripts/
    ├── deploy.sh            ← local deploy helper
    ├── rollback.sh          ← revert to a previous Netlify deploy
    └── health-check.sh      ← HTTP health verification
```

---

## Step 1 — GitHub Secrets

Go to: **GitHub → Repo → Settings → Secrets and variables → Actions → New repository secret**

| Secret name              | Value                                      |
|--------------------------|--------------------------------------------|
| `NETLIFY_AUTH_TOKEN`     | Personal access token from Netlify         |
| `NETLIFY_SITE_ID`        | Site ID of your **production** Netlify site |
| `NETLIFY_STAGING_SITE_ID`| Site ID of your **staging** Netlify site   |

### How to get these values

**`NETLIFY_AUTH_TOKEN`**
1. Go to [Netlify → User Settings → Applications](https://app.netlify.com/user/applications)
2. Click **New access token**
3. Copy the token (shown once)

**`NETLIFY_SITE_ID`** (production)
1. Open your Netlify site dashboard
2. Go to **Site configuration → General**
3. Copy the **Site ID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

**`NETLIFY_STAGING_SITE_ID`**
1. Create a second Netlify site (can be empty initially)
2. Follow the same steps as above

---

## Step 2 — GitHub Environments

Go to: **GitHub → Repo → Settings → Environments**

### Create `staging` environment

1. Click **New environment** → name it `staging`
2. No approval gate needed (auto-deploys)
3. Optional: add `STAGING_SITE_URL` as an environment variable

### Create `production` environment (CRITICAL)

1. Click **New environment** → name it `production`
2. ✅ Enable **Required reviewers**
3. Add yourself (and any teammates) as required reviewers
4. ✅ Enable **Prevent self-review** (optional but recommended)
5. Set **Wait timer** to `0` minutes (approval is the gate)
6. Optionally restrict to branch `main` only

> **This is the manual approval gate.** When `production.yml` reaches the
> `await-approval` job, GitHub will pause and send you an email/notification.
> You must go to the Actions run and click **Review deployments → Approve**.

---

## Step 3 — Branch Protection Rules

Go to: **GitHub → Repo → Settings → Branches → Add branch ruleset**

### Protect `main` (and `master`)

```
Branch name pattern: main
                     master

Rules to enable:
  ✅ Require a pull request before merging
       └─ Required approvals: 1
  ✅ Require status checks to pass before merging
       └─ Add: "Lint · Type-check · Build"  (from pr-validation.yml)
  ✅ Require branches to be up to date before merging
  ✅ Do not allow bypassing the above settings
  ✅ Restrict deletions
  ✅ Block force pushes
```

---

## Step 4 — Optional: Repository Variables

Go to: **GitHub → Repo → Settings → Secrets and variables → Actions → Variables**

| Variable name         | Value                             |
|-----------------------|-----------------------------------|
| `STAGING_SITE_URL`    | `https://staging.jesusvelez.xyz`  |

---

## Workflow Behavior Summary

| Event                              | Workflow triggered     | Result                          |
|------------------------------------|------------------------|---------------------------------|
| Push to `feature/*`, `fix/*`, etc. | `staging.yml`          | Build + deploy to Netlify draft |
| PR opened → `main` or `master`     | `pr-validation.yml`    | Type-check + build (blocks PR)  |
| Merge into `main` or `master`      | `production.yml`       | Build → **pause for approval**  |
| Manual approval in GitHub Actions  | `production.yml`       | Deploy to Netlify `--prod`      |
| `workflow_dispatch` on `main`      | `production.yml`       | Build → **pause for approval**  |

---

## Rollback Procedure

### Option A — Netlify dashboard
1. Go to your site in Netlify → **Deploys**
2. Find the last good deploy
3. Click **Publish deploy**

### Option B — Script
```bash
export NETLIFY_AUTH_TOKEN=your-token
export NETLIFY_SITE_ID=your-site-id
./scripts/rollback.sh
# Prompts you to pick a deploy ID, then confirms before rolling back
```

### Option C — Re-run production workflow
1. Go to **Actions → Production Deploy**
2. Click **Re-run jobs** on a previous successful run

---

## Local Deploy (bypassing CI)

```bash
# Build first
npm run build

# Deploy to staging
export NETLIFY_AUTH_TOKEN=xxxx
export NETLIFY_STAGING_SITE_ID=xxxx
./scripts/deploy.sh staging

# Deploy to production (requires confirmation prompt)
export NETLIFY_SITE_ID=xxxx
./scripts/deploy.sh prod
```

---

## Security Recommendations

| Area | Recommendation |
|------|----------------|
| Secrets | Never commit `.env` files. Use GitHub Secrets only. |
| Tokens | Use a scoped Netlify token (not your personal account token in prod). |
| Branch protection | Always require PRs + status checks on `main`/`master`. |
| Environment isolation | Use separate Netlify sites for staging and production. |
| Approval gate | Add at least 2 required reviewers for production in larger teams. |
| Audit log | GitHub keeps an audit log of who approved deployments. |
| Artifact retention | Production artifacts are kept 30 days for rollback. |

---

## Dependency Caching

All workflows use `actions/setup-node@v4` with `cache: "npm"`, which caches
`~/.npm` automatically. This reduces install time by ~60% after the first run.

For faster cold starts, ensure your `package-lock.json` is committed.
