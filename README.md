# Tap For Good — Contactless Giving for Charities

**CodeSprintMT 2026 · Open Category** submission.

Tap For Good closes the gap that stops charities taking spontaneous donations: it lets a donor give in seconds via a simulated **tap-to-pay** or real **card entry**, and gives charity staff a full admin tool to manage campaigns, watch donations land in real time, reconcile against the Mastercard sandbox, and export for accounting.

Built with **Laravel 13 + Inertia (React 19) + Tailwind v4**, organised into a `Domain\` (DDD) layer with a REST-style separation between presentation and logic. It uses **SQLite** as its database, so **no MySQL/Postgres server is required** — the database is a single file and every supported PHP build ships with the SQLite driver.

---

## Requirements

| Tool         | Version  | Notes                                                        |
| ------------ | -------- | ------------------------------------------------------------ |
| **PHP**      | **8.5+** | Must include the `pdo_sqlite` extension (bundled by default) |
| **Composer** | 2.x      | https://getcomposer.org/download/                            |
| **Node.js**  | 22+      | https://nodejs.org/                                          |
| **npm**      | 10+      | Ships with Node.js                                           |

Verify PHP and its SQLite driver:

```bash
php -v                  # should report 8.5.x
php -m | grep -i sqlite # should list pdo_sqlite and sqlite3
```

macOS tip: [Laravel Herd](https://herd.laravel.com/) bundles PHP and manages local `.test` domains.

---

## Setup

From the project root, run the one-command setup:

```bash
composer setup
```

This installs dependencies, creates `.env`, generates the app key, **creates the SQLite database, runs migrations and seeds demo data (charities, campaigns, donations and login accounts)**, then builds the frontend.

<details>
<summary>Manual steps (if <code>composer setup</code> is unavailable)</summary>

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
npm install
npm run build
```
</details>

To reset to a clean, freshly-seeded state at any time:

```bash
php artisan migrate:fresh --seed
```

---

## Running the app

```bash
composer dev
```

This starts the PHP server, queue listener, log tailer and Vite together. Open the URL shown in the terminal (default http://127.0.0.1:8000).

- **Donation app (public):** the home page — browse causes and donate. No login required.
- **Admin tool:** log in at `/login`, then `/admin/dashboard`.

---

## Demo accounts

All accounts use the password **`password`**. They demonstrate role-based access (M2.1):

| Email                   | Role          | Access                                              |
| ----------------------- | ------------- | --------------------------------------------------- |
| `admin@example.com`     | super-admin   | Everything (incl. user management + audit log)      |
| `charity@example.com`   | charity-admin | Campaigns, charities, ledger (no users / audit log) |
| `volunteer@example.com` | volunteer     | Read-only views                                     |
| `auditor@example.com`   | auditor       | Read-only + audit log + exports                     |

---

## Mastercard sandbox (optional)

The app runs fully **without** any Mastercard configuration. Card payments make a real OAuth 1.0a-signed call to the Mastercard Donate sandbox **when** credentials and a signing key are set in `.env` (`MASTERCARD_*`); otherwise — or if the sandbox is unreachable — the payment **gracefully falls back** to a local authorisation so the donation flow always completes. Set `MASTERCARD_SIMULATE=true` to skip the network call entirely.

Verify configured credentials with:

```bash
php artisan mastercard:ping
```

---

## Feature overview

**Donation app** — campaign/charity branding · preset + custom amounts · multi-currency (EUR/USD/GBP) · simulated tap-to-pay + real card-entry against the Mastercard sandbox · confirmation + email receipt · graceful error handling · accessibility (text-size + high-contrast, persisted) · recurring / round-up · Gift Aid declaration.

**Admin tool** — role-based access (super-admin / charity-admin / volunteer / auditor) · campaign & charity CRUD · **live dashboard** (auto-polls every 20s + on focus) · filterable transaction ledger · CSV export (ledger) and CSV/PDF export (audit log) · Mastercard reconciliation view · audit log of admin actions · user management.

---

## Testing

```bash
php artisan test
```

The suite currently passes **93 tests**.

---

## Submission contents

- **Source code** — this repository.
- **Demonstration video** — included with the submission (see the accompanying video file / link).
