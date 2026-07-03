# CodeSprint 26

A Laravel 13 + Inertia (React) application built for the CodeSprint 26 competition.

This project uses **SQLite** as its database, so **no MySQL/Postgres server is required** — the database is a single file and every supported PHP build ships with the SQLite driver enabled.

## Requirements

Before setting up, make sure the following are installed:

| Tool         | Version         | Notes                                                        |
| ------------ | --------------- | ------------------------------------------------------------ |
| **PHP**      | **8.5+**        | Must include the `pdo_sqlite` extension (bundled by default) |
| **Composer** | 2.x             | https://getcomposer.org/download/                            |
| **Node.js**  | 22+             | https://nodejs.org/                                          |
| **npm**      | 10+             | Ships with Node.js                                           |

### 1. Install PHP 8.5

**macOS** (via [Homebrew](https://brew.sh/)):

```bash
brew install php@8.5
```

Or install [Laravel Herd](https://herd.laravel.com/), which bundles PHP and manages local `.test` domains.

**Windows / Linux:** download from [php.net/downloads](https://www.php.net/downloads) or use your package manager. Verify with:

```bash
php -v   # should report 8.5.x
```

Confirm the SQLite driver is present (should list `pdo_sqlite` and `sqlite3`):

```bash
php -m | grep -i sqlite
```

### 2. Install Composer

Follow the official installer at https://getcomposer.org/download/, then verify:

```bash
composer --version
```

## Setup

From the project root, run the one-command setup:

```bash
composer setup
```

This will:

1. Install PHP dependencies (`composer install`)
2. Create your `.env` file from `.env.example`
3. Generate the application key
4. Create the SQLite database and run all migrations
5. Install Node dependencies (`npm install`)
6. Build the frontend assets (`npm run build`)

> If `composer setup` is unavailable for any reason, run the equivalent steps manually:
>
> ```bash
> composer install
> cp .env.example .env
> php artisan key:generate
> touch database/database.sqlite
> php artisan migrate
> npm install
> npm run build
> ```

## Running the app

Start the full development environment (server, queue, logs, and Vite) with:

```bash
composer dev
```

Then open the URL shown in the terminal (default: http://127.0.0.1:8000).

## Testing

```bash
php artisan test
```
