# Tap For Good — Progress Tracker

Living scorecard for the CodeSprintMT 2026 Open Category submission ("Tap For Good — Contactless Giving for Charities"). Max score: **345 pts**.

> **Snapshot:** re-audit 2026-07-04 (8th pass). Point-in-time read; update as work lands. **Test suite: 93 passing, 0 failing.**
> Status legend: ✅ Done · ⚠️ Partial · 🔴 Broken (coded but errors at runtime) · ❌ Not started

---

## Score summary

- **Defensibly working today: ~245 / 345** (M1.7 accessibility + C3.1 real-time dashboard done; Gift Aid + round-up/recurring in)
- Public **show** page now reads real raised/donor stats from the DB; the **listing** (`welcome.tsx`) progress bar is still hardcoded at `45%`.
- Admin campaign **create/edit** pages now exist (+ a charities CRUD), closing the earlier M2.2 gap.

---

## Core — Donation App (M1) · 100 pts

| # | Criterion | Pts | Status | Notes |
|---|-----------|-----|--------|-------|
| M1.1 | Branding | 10 | ✅ Done | `brand_color`, logo (medialibrary), hero image, `surface_tint`, presets flow to UI |
| M1.2 | Preset amounts + custom | 10 | ✅ Done | 3 presets + custom-amount toggle in `donation-form.tsx` |
| M1.3 | Donation flow + Mastercard sandbox | 20 | ✅ Mostly | Flow works end-to-end. Card payments now make a **real OAuth-signed call** to the Donate sandbox (`payments/guests`), reflect the response, and fall back gracefully (sandbox account isn't entitled to a live program). Tap stays simulated. `MASTERCARD_SIMULATE=true` forces offline mode. Covered by `MastercardServiceTest` |
| M1.4 | Confirmation + receipt | 20 | ⚠️ Better | Confirmation screen ✅ + receipt-modal UI + "send receipt" ledger action + `receipt_sent_at`. But `DonationReceiptService` is a **stub** — it `Log::info()`s instead of sending real email (no Mailable). Needs a real Mail send |
| M1.5 | Multi-currency | 15 | ✅ Mostly | `Currency` model, EUR/GBP/USD seeded, `Intl.NumberFormat`. No FX conversion (not required) |
| M1.6 | Graceful errors | 15 | ⚠️ Partial | Client `failed` step + toast + simulated decline (card `0000`). Server validation weak — `DonationRequestData` has no `rules()` |
| M1.7 | Accessibility (large-text / high-contrast) | 10 | ✅ Done | Text size (3 steps) + high-contrast token/brand swap + dark/light, persisted via cookie (no flash) + localStorage. Responsive control: header on desktop, unobtrusive floating button on mobile (`accessibility-menu.tsx`). `useBrandBranding` neutralises charity colours in high-contrast. Manual theme toggle removed by request — dark/light now follows the OS silently. Covered by `AccessibilityPreferencesTest` |

## Core — Admin (M2) · 105 pts

| # | Criterion | Pts | Status | Notes |
|---|-----------|-----|--------|-------|
| M2.1 | RBAC (Auditor < Volunteer < Admin) | 20 | ✅ Done | Roles seeded (`charity-admin`, `volunteer`, `auditor`, `super-admin`) + permission middleware |
| M2.2 | Create & manage campaigns | 20 | ✅ Mostly | Full CRUD backend + `create.tsx`/`edit.tsx` (componentized form). Charities CRUD also added |
| M2.3 | Live dashboard | 20 | ✅ Mostly | Total raised / donors / avg / progress + recharts bar chart. Not real-time (see C3.1) |
| M2.4 | Transaction ledger | 15 | ✅ Done | Loads, filters, grouped search. Restored `use Inertia\Response;` after a refactor dropped it. Covered by 4 passing tests |
| M2.5 | CSV & PDF export | 10 | ⚠️ Partial | Works for audit log only; not wired to the transaction ledger |
| M2.6 | Reconciliation view | 10 | ⚠️ Works (simulated) | Loads again (Response import restored). Discrepancies are faked (`id % 20`); real reconciliation blocked by the 401 program entitlement |
| M2.7 | Audit log | 10 | ✅ Done | activitylog + viewer; donations logged in `DonationProcessor` |

## UI/UX · 25 pts

| Criterion | Pts | Status | Notes |
|-----------|-----|--------|-------|
| Neat / aesthetically pleasant UI | 10 | ✅ Done | Public pages genuinely polished |
| Easy to use | 5 | ✅ Done | Intuitive flow |
| Responsive (desktop + mobile) | 10 | ✅ Done | Tailwind responsive throughout |

## Code Quality · 35 pts

| Criterion | Pts | Status | Notes |
|-----------|-----|--------|-------|
| Organized into modules | 5 | ✅ Done | `Domain\` DDD layout |
| Separation presentation/logic | 10 | ✅ Done | Domain services (`DonationProcessor`, `MastercardService`) + DTOs |
| Consistent paradigm | 5 | ✅ Done | OOP + typed |
| Function cohesion | 5 | ⚠️ | Mostly small/focused |
| Inline documentation | 5 | ⚠️ | Sparse |
| Maintainable code | 5 | ✅ Done | Enums, DTOs, final classes |

## Additional (S / C) · 80 pts

| # | Criterion | Pts | Status | Notes |
|---|-----------|-----|--------|-------|
| S1.1 | Recurring / round-up | 10 | ✅ Mostly | `is_recurring` + `round_up` columns, `donation-options.tsx` UI. UI/data prototype (no Mastercard stored-card enrolment — by decision, and enrolment is blocked anyway) |
| S1.2 | Tax / Gift-Aid | 10 | ✅ Mostly | Migration (`gift_aid_*`), `DonationUpdateData`, processor computes 25% uplift + total benefit, `gift-aid-form.tsx` UI |
| C1.3 | Donor recognition | 20 | ⚠️ | `is_anonymous` captured, but public pages show hardcoded donor counts; real names not displayed |
| C1.1 | Mobile app | 15 | ❌ | — |
| C2.1 | Multilingual UI | 15 | ❌ | — |
| C3.1 | Real-time dashboard | 10 | ✅ Done | Admin dashboard polls every 20s via Inertia `usePoll` (partial reload of stats/campaigns/recent), auto-throttles when the tab is hidden, and re-polls immediately on window focus. Pulsing "Live · <time>" indicator |

---

## 🔴 Must-fix bugs (coded but broken — ~35 pts at risk)

1. **`welcome.tsx` listing progress bar is hardcoded** at `45%` — wire real `withSum(status=success)` / donor counts (the show page and admin dashboard already do this correctly — copy the pattern).

### Fixed since first audit
- ~~Client dashboard removed~~ → route/page/nav gone; non-staff now land on the public home after login; auth tests repointed to `route('home')`.
- ~~Super-admin saw no audit-log/user-management nav~~ → there was no super-admin account (admin was `charity-admin`). Fixed: `admin@example.com` is now `super-admin`; `charity-admin` stays restricted per `RoleAccessTest`; `AuditLogTest` uses super-admin. `DonationFactory` now sets `amount_in_base_currency` (was 0), fixing multi-currency stat tests.
- ~~Admin campaign create/edit pages missing~~ → done (+ charities CRUD).
- ~~`donation/show.tsx` fake stats~~ → now reads real raised/donor counts.
- ~~`mastercard:ping` broken~~ → stale `DonateClient` import fixed (command now runs).
- ~~Ledger + reconciliation crash~~ → stale `DonateClient` import + `transaction_id` column fixed; covered by `tests/Feature/Admin/DonationLedgerTest.php` (4 passing).
- ~~Ledger search leaked past filters~~ → `orWhere` clauses now grouped in a closure.
- ~~Tap-to-pay failed entirely~~ → three bugs fixed: (1) `currencyId` now derived server-side from the campaign, (2) empty `card` no longer sent for tap, (3) `DonationController` compared the `DonationStatus` **enum** to the string `'success'` (always false → always flashed error). All covered by `DonationTest`.

## Mastercard sandbox status (verified 2026-07-04)

- ✅ **Signing / credentials / connectivity work** — `GET /transactions` reaches the Donate service and returns valid business responses (`mastercard:ping`).
- 🔴 **Program/charity endpoints return 401 "Access Not Granted"** — `GET /programs/{id}/charities` is refused; the `program_id` in config isn't entitled. Live, program-scoped donation processing is therefore still blocked (matches the documented blocker).
- **What we can integrate now:** make card-details payments perform a *real signed call* to the sandbox (e.g. a `/transactions` lookup) so M1.3 can truthfully demo real API validation, with graceful fallback to simulation on business/entitlement errors. Full live charging depends on organizer-provisioned credentials.
- ✅ **Implemented (4th pass):** card payments now POST a real OAuth-signed request to `payments/guests`. Verified live — the call reaches the Donate service (`ReasonCode: INTERNAL_SERVER_ERROR` on the unprovisioned account) and the response (`http_status`, `reason_code`, `api_message`) is captured into `donation.metadata.mastercard`. On any refusal/exception the service falls back to a local approval so the flow completes; `MASTERCARD_SIMULATE=true` skips the network entirely. Tap remains simulated (sandbox has no contactless).

## ⚠️ Biggest scoring risks

- **M1.3** — card payments must validate against the Mastercard sandbox; currently 100% simulated. See Mastercard status above.
- **Demo video** — failure to submit = **instant disqualification**; un-demoed features are not graded.

## Quick wins (high pts / low effort)

- Fix the two 🔴 broken admin views (M2.4, M2.6) — ~25 pts.
- Add admin campaign `create`/`edit` pages (M2.2) — ~10 pts.
- Wire real stats into public pages (supports C1.3 + credibility).
- Wire ledger CSV/PDF export (M2.5) — export actions already exist and are reusable.
- Accessibility toggle for large-text + high-contrast (M1.7) — ~10 pts.

---

## ⚠️ Working-tree note

A second Claude Code session has been editing this repo concurrently and drove most of the current backend (the `Domain\` DDD structure, controllers, `DonationProcessor`, `MastercardService`, `Currency`). Coordinate before large edits to avoid clobbering.
