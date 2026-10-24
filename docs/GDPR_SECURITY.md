# Security audit and GDPR gap analysis

Checked 24 October 2026. This is an engineering gap list for the owner. **It is not legal advice.** Items marked **Lawyer** need a qualified adviser (Danish counsel familiar with the GDPR and children’s data) before they are treated as done. Nothing here was applied to production data, production environment variables, or the superadmin area.

## Scope and what could not be verified

Two different systems showed up. Findings are labelled so they are not mixed.

| System | What was actually inspected | What this pull request can change |
| --- | --- | --- |
| Live product, staging `https://acecourt-staging.vercel.app` and production `https://www.acecourt.dk` | Public pages, response headers, and the staging JavaScript the browser downloads. Read-only. No login, so no child rows were opened. | **Nothing.** That Next.js source is not in this repository. |
| This repository (Vite prototype, also served at `acecourt-eight.vercel.app`) | SQL migrations, edge functions, and `npm audit` of this lockfile. | One log line, below. No migration was added or applied. |

Not visible from here, so not claimed:

- Row Level Security and API authorization inside the live Next.js server.
- Whether attendance XP is idempotent.
- The text of emails and of parent links (those routes were not in the public bundles).
- Whether any server action sends personal data to an AI provider.
- The Supabase region, the Vercel function region, backup location, and the email vendor. Those are dashboard settings, not in this repo.
- A logged-in pass for IDOR. Guessing another club’s ids against staging would read real children’s rows, so it was not done.

Superadmin (`/superadmin` on staging) was read in the client bundle and **not modified**. Its allowlist and its four APIs stay as they are. See `docs/REVIEW.md`.

## What was fixed here

`supabase/functions/invite-member` logged the invitee’s email and the raw invitation token, and logged the full URL with that token. Those lines are gone, and the function no longer logs the database error object (that object can echo the address). The JSON response is unchanged, so any caller that already expected `token` still works. The function is still unauthenticated and still returns the token. Deploying it is a separate step on the **legacy** Supabase project. It does not run on staging or on `www.acecourt.dk`.

Not fixed, because the change would either hit the wrong database or edit an app that is not in this repo:

- Security headers for the Next.js app.
- Export and erasure jobs.
- Live RLS, rate limits, and parent-link tokens.
- `npm audit fix` (a forced fix jumps Vite to a new major, and this lockfile is not the live app).

## Security audit

Severity is about the **live** product unless the row says Legacy.

### Critical

| Finding | Evidence | Fix |
| --- | --- | --- |
| Legacy service-role functions do not check the caller. `process-xp` can grant XP repeatedly and trusts a client total. `assign-role` can grant `admin`. `invite-member` creates an invite for any posted email and returns the token. | `supabase/functions/*/index.ts` in this repo. | Do not point a club at this database. If the legacy project is still reachable, disable the three functions and rotate the service-role key. Effort: **Small** (dashboard + key rotation). Not done here: it is an operations change on a third database, and the code change would not deploy by merging this PR. |
| Legacy `profiles` update policy lets a signed-in user write `xp`, `ace_coins`, and `club_id`. | `supabase/migrations/002_rls_policies.sql`, `profiles_update_own` has no column restriction. | Replace with a policy that allows name and avatar only, and move XP to a security-definer function. Effort: **Small**, but it is a migration against the legacy database, so it is not in this PR. |

### High

| Finding | Evidence | Fix |
| --- | --- | --- |
| Parent dashboard reads and renders level, XP, and AceCoins, and is built to render CourtDNA `score/5`. | Staging bundle for `/foraeldre/dashboard`. The score array is currently stubbed to `[]`, so the numbers are not shown today. The level and XP are real columns. | Stop selecting those columns for the parent role. Select public fields only on `training_updates`. Confirm the same fields are absent from parent emails. Effort: **Small** in the real repo (one page, one email audit). **Lawyer:** hiding a field in the UI does not remove it from an access request. |
| Live authorization on the server was not reviewable. The client sends `club_id` and player ids. A client check is not isolation. | Attendance posts `session_id`, `club_id`, and player id lists. Parent and player pages query Supabase from the browser. | In the real repo, every mutation must derive the club from the session and reject ids from another club. Add a staging test that user A cannot read user B’s child. Effort: **Medium**. |
| Superadmin is a single user id compiled into the public JavaScript, not a role. | Staging `/superadmin` bundle. The id is not repeated in this document. | **Do not change this screen in a drive-by patch.** The protection has to be on the four APIs and on RLS. Confirm those reject every other user. Effort: **Small** to verify, **not** a code change in this PR. |
| Invitation tokens in this repo are `md5(random())`, returned to the browser, and (until this PR) written to logs. | `003_club_invitations.sql`, `invite-member`, `inviteMember` in `src/lib/supabase.ts`. | Store only a hash of a long random token, expire it, and mail it. The React client currently selects the token itself, so removing the log is not sufficient. Effort: **Medium** on the legacy project. Live parent links: see below, format unknown. |
| Staging login response allows any origin (`access-control-allow-origin: *`) and sends no Content-Security-Policy, `X-Frame-Options` / `frame-ancestors`, `Referrer-Policy`, or `Permissions-Policy`. HSTS is present (`max-age=63072000`, includeSubDomains, preload). | `GET /login` on staging, 24 October 2026. Production HSTS was observed earlier without `includeSubDomains` and without `preload`. | Add the headers in the Next.js config. Keep `connect-src` tight enough for the staging Supabase host and no one else. Do not copy a `vercel.json` into **this** repo: merging it would change the old Vite deploy, which GitHub already labels Production. Effort: **Small** in the real repo. |

### Medium

| Finding | Evidence | Fix |
| --- | --- | --- |
| No rate limit was visible on login, invite, password reset, or `/api/ical/link`. | No limiter in this repo. Staging headers do not show one. `/api/ical/link` without a session returns 401, which is good, and says nothing about brute force. | Limit login, reset, invite, and the calendar link per IP and per account. Effort: **Small** to **Medium** (middleware plus a store). |
| Attendance can be saved again from a screen that marks everyone present and does not load the previous row. | Staging attendance bundle. | Unique `(session_id, player_id)`, upsert, server-side XP ledger. Effort: **Medium**, staging migration first, columns nullable or defaulted so superadmin inserts keep working. Design is in `docs/REVIEW.md`. Not a migration file in this PR. |
| `demo_mode` in `sessionStorage` lets an admin through other role guards. | Staging client. | Treat it as a UI convenience only. Server must ignore it. Confirm it is off in production. Effort: **Small**. |
| Legacy RLS is incomplete: no insert policies, `user_roles` policy reads `user_roles` (recursion risk), several tables have RLS and no policies, signup trigger writes the generated `level` column. | Migrations `001`–`003`. | Do not ship this schema. Effort: not worth repairing for the live product. |
| Dependency vulnerabilities in **this** lockfile. `npm audit --omit=dev` on 24 October 2026: 8 issues, 4 high and 4 moderate. High: `nanoid`, `postcss`, `source-map-js`, `ws`. Moderate: `react-router` / `@remix-run/router` (open redirect), `postcss-selector-parser`. | This repo’s `package-lock.json` only. | Re-audit the Next.js lockfile in the real repo. Do not `npm audit fix --force` here. Effort: **Small** once that lockfile is in hand. |

### Low

| Finding | Evidence | Fix |
| --- | --- | --- |
| Parent-looking paths on staging (`/foraeldre/afbud`, `/afbud`, `/p`, `/u`, `/invite`, `/t`, `/kalender`) returned 404. | Read-only GET. | Find the real link format in the mailer and check it cannot be swapped to another child, cannot be replayed, and cannot reach ratings. Effort: **Small** once the template is open. |
| Anon Supabase keys are inside the public JavaScript. | Both apps. Normal for the Supabase client. The keys are not copied into this document. | Confirm the service-role key is not prefixed `NEXT_PUBLIC_` and is not in the bundle. Effort: **Small**. |
| Legacy shop grants an item without spending coins, and the call passes arguments in the wrong order. | `purchaseItem` vs `ProShop.tsx`. | Irrelevant to the live app. Leave it. |

### Input validation (legacy only)

`invite-member` checks that email, role, club id, and inviter are present. It does not check email shape or that the role is one of the allowed values (the table constraint does). `process-xp` accepts a client-supplied score total. The live attendance API’s validation was not visible; the client does not send an XP amount, which is the right split.

### Secrets and environment

This repo’s `.env.example` is a placeholder URL and a placeholder anon key. `supabase/config.toml` has a local placeholder JWT secret, not a hosted one. No production env was read or written. Staging HTML references `NEXT_PUBLIC_DEMO_EMAIL` / `NEXT_PUBLIC_DEMO_PASSWORD`; they are unset, so `/demo` stops before sign-in. Demo passwords must not be committed. Prefer a staging-only auth user over baking a password into the client bundle even when the variables are set: `NEXT_PUBLIC_` values ship to every browser.

## GDPR gap analysis

The platform is built for junior players. The staging parent and player pages, the player insert used by superadmin, and `/privatliv` together show that children’s names, contact data, age, attendance, and development notes are in scope. Treat the data as children’s data until counsel says otherwise.

### Data inventory

**Live product, seen in the staging client or in the privacy page.** “Where” is the table the browser queried, or “server, not visible” when only an API was called.

| Data | Where it showed up | Who the UI shows it to | Child? |
| --- | --- | --- | --- |
| Player name, email, birth year, age category | Player insert from superadmin; age category also on the parent query | Coaches, admins, superadmin. Age category also selected for parents | Yes, when the player is a junior |
| Level, XP, AceCoins | `players` columns, parent dashboard and player home | Player home (intended). Parent dashboard (not intended) | Yes |
| Team, court, session time, cancellation, message text | `teams`, `training_sessions`, `training_updates` | Coach, player, parent | Practical info; the message body can still be personal |
| Attendance present/absent | `attendance`; parent page also computes a lifetime percentage | Coach. Parent sees a percentage | Yes |
| CourtDNA / session ratings (`score` per dimension) | Quick-rating API; parent page has a card for it | Coach. Parent card is stubbed empty | Yes, evaluative |
| Focus text and `review` | `/api/spiller/fokus` | Player. Contents of `review` not visible (logged-out call returned `{"focus": null}`) | Yes |
| Account email, role (`admin`, `trainer`, `player`, `parent`) | `profiles` | The signed-in user; admins | Parent and child accounts |
| Club name and settings | `clubs` | Club staff; superadmin sees all clubs | No, but it is the tenant boundary |
| IP address and browser | Claimed in `/privatliv` (“IP/browser”). Not confirmed in code | Unknown | Can be a child’s device |
| Usage data | Claimed in `/privatliv`. No product-analytics vendor string was found in the staging bundles that were read | Unknown | Unknown |

**Not found in the scanned staging JavaScript:** OpenAI, Anthropic, Gemini, Resend, SendGrid, Sentry, PostHog. Absence in the client does not mean the server never calls them.

**Legacy prototype only** (different database; do not treat as the live inventory): `profiles` (name, avatar, XP, generated level, coins, birth year, club), `auth.users` email, `club_invitations.email` and token, attendance, MDE evaluations and free-text notes, six skill scores, goals, streaks, badges, leaderboard, shop inventory. Roles are `admin` / `coach` / `player`. There is no parent table.

**Lawyer:** build the real record of processing from the live database, the auth schema, storage buckets, email logs, and backups. This table is only what a public client revealed.

### Legal basis and parental consent

`/privatliv` (Danish, “Sidst opdateret: 26. maj 2026”) says AceCourt ApS is the controller, contact `hej@acecourt.dk`, and cites contract, consent for a newsletter, and legitimate interest. It does not mention children, parents, birth year, CourtDNA, focus notes, AceCoins, or a guardian.

No consent screen, checkbox, or stored consent row was found in the client.

**Lawyer, before any wording is published:**

- Who is the controller for a junior’s data: the club, AceCourt, or both for different purposes. `/vilkaar` says player data “belongs to the club” and is deleted when the club cancels. `/privatliv` says AceCourt is the controller. Those two sentences cannot both be the whole story.
- Whether a contract with the club covers the child’s data, or whether a parent must consent, and for which age bands (Denmark’s digital-consent age is not something this document decides).
- How consent is recorded: which child, which parent, which text version, when, and how it is withdrawn.
- Whether XP, coins, and a shop are compatible with the purpose told to parents.
- Whether “at risk of quitting” profiling needs a separate basis and a human review. The flag is coach-only today, which is the right direction; the legal basis is still **Lawyer**.

Effort to **store** a consent row once counsel defines it: **Medium** (table + import/signup step + superadmin-safe nullable columns). Do not invent the legal text in the app.

### Data minimisation

The parent page selects level, XP, coins, all columns of `training_updates`, and is ready to select ratings. The attendance screen loads every active player in the club when a team has no members. Superadmin selects `clubs` with `*`.

Recommendation: each role has an explicit column list. Parents: name, next session, court, cancellation, focus sentence. Players: those, plus their own XP and level. Coaches: ratings and the risk flag. Admins: the club list. Superadmin keeps its current queries (do not change that screen); minimisation there is a later, separate change so the allowlist behavior stays intact.

Effort: **Small** for the parent query. **Medium** to do it for every role and for emails.

### Retention and deletion

`/privatliv` says data is kept while the account is active, deleted within 90 days of cancellation, and removed from backups within a further 30 days. No scheduled job, no deletion API, and no backup policy were in this repo or in the public client. There is no self-serve “delete this player”.

**Lawyer:** confirm the 90/30 day story against real backups (Supabase PITR, Vercel logs, email provider logs). Some records (invoices) may need to be kept longer; the policy should say so instead of promising a full wipe.

Effort to implement a job after the periods are confirmed: **Medium**.

### Access (export) and erasure, per player

Not implemented. A safe shape for the real repo, staging first:

1. Club admin only, inside their own club. Server derives `club_id` from the session. Superadmin’s existing screens stay untouched; do not hang erasure on `/superadmin`.
2. **Export** writes one JSON (or CSV) file for one player id: identity, guardians, attendance, sessions they were on, focus text, messages sent about them, consent rows, and coach evaluations. Store the file briefly in a private bucket and delete it after download.
3. **Erasure** deletes or irreversibly anonymises that player’s rows (profile, attendance, ratings, focus, parent links, auth user if the child has a login). Keep an audit row with a timestamp, the admin’s id, and a hash of the player id, not the child’s name. If counsel requires invoices to survive, keep those and drop the name.
4. Re-running erasure is safe (idempotent). Export after erasure returns “not found”.
5. Dry-run on staging with a fixture player, never with a production id.

**Lawyer:** a parent’s access request may include coach evaluations even though the parent UI must not show them day to day. Erasure can collide with the club’s need to keep a season record. The tool should follow the decision counsel writes down, not a guess in this file.

Effort: **Medium** (one server route, one admin button, staging test). Not built here, because there is no live server code in this repo and a script pointed at staging would need production-grade credentials this run does not have and should not use.

### Processors and sub-processors

Known from the outside. Roles are **not** a legal conclusion.

| Vendor | What we can see | Likely role | Region |
| --- | --- | --- | --- |
| Vercel | Hosts both Next.js apps. Staging sent `server: Vercel`. | Hosting the application. | Not stated on the page. Confirm the project region. |
| Supabase | Browser talks to a hosted Postgres and Auth. Staging and production use **different** projects. This Vite repo uses a **third** project. | Database and authentication. | Not visible in the client. Confirm in the project settings. EU is available; it is not proven. |
| Google Fonts | Staging HTML loads `fonts.googleapis.com` and `fonts.gstatic.com`. | Font delivery. The visitor’s IP is sent to Google. | Google. This is a transfer, and it is missing from `/privatliv`. |
| Email provider | Coaches are invited and parents are mailed, according to `/guide`. No vendor string in the scanned JS. | Delivers personal data (names, session times, possibly a child’s name). | Unknown. **Lawyer** and a DPA with that vendor. |
| AI provider | No SDK name in the scanned JS. “AI Team Match” appears as marketing and guide copy. | Unknown. May be unused. | Unknown. |
| AceCourt ApS | Named on `/privatliv` and `/vilkaar`. | Named as controller. Clubs need their own role clarified. | Denmark, if the company details are right. **Lawyer** to confirm the company and the role. |

Effort to publish an accurate sub-processor list after the dashboards are checked: **Small** for engineering to list regions, **Lawyer** for the list itself.

### Personal data and AI

No client call to an AI API was found. The server was not readable. Until the real repo is checked, assume nothing and do not claim “we do not use AI”.

If a feature ranks players or drafts a focus sentence, the safe default is: no name, no email, no birth year, no free-text note that contains a name, and no club name. Send an opaque id the model never stores, or skip the network and compute the flag in Postgres (the risk flags already look like ordinary queries). Sign a DPA with the provider and pick an EU region before any real child’s text is sent.

Effort: **Small** to grep the real server and add a deny-list test. **Large** if a feature already sends notes and has to be redesigned.

### Logging of personal data

Fixed in this repo: `invite-member` no longer logs the email, the token, or the driver error object. Do not log caught error objects in the live app either; a Postgres error can echo the row.

Recommendations for the Next.js app:

- Log ids and status codes, not names, emails, birth years, tokens, or focus text.
- Password-reset and invite handlers must not log the link.
- Vercel request logs and Supabase API logs count. Turn down auth-log verbosity if it stores emails in plain text longer than counsel allows.

Effort: **Small** once the server source is open.

### Cookies and consent banner

`/privatliv` says the site uses only necessary session cookies and does not use tracking or advertising. No cookie-banner string was found in the scanned staging JS. No `Set-Cookie` was present on an anonymous `GET /login`.

A banner is the wrong first step if the only cookies are the session. The Google Fonts requests are the concrete mismatch: they are not “no third parties”. Self-host the font files and drop the Google URLs. Then re-read the cookie claim.

**Lawyer:** confirm that Supabase auth cookies are strictly necessary and that no analytics cookie is set on production. Add a banner only if something non-essential remains.

Effort: **Small** to self-host fonts.

### Privacy policy and terms versus actual behavior

Pages that exist on staging: `/privatliv`, `/vilkaar` (both 200). `/privacy`, `/terms`, `/cookies`, `/dpa`, and `/gdpr` return 404. Staging’s canonical and social tags still point at `acecourt.dk`.

| The page says | What the app does | Gap |
| --- | --- | --- |
| AceCourt is controller. Terms: player data belongs to the club. | A club admin and a superadmin both operate on the same child rows. | **Lawyer.** Pick a model and use it in both documents. |
| Data: name, email, player data including level and attendance, usage, IP, browser. | Also birth year, age category, parent contacts, CourtDNA, focus, AceCoins, messages. | Inventory is short of the product. |
| Contract, newsletter consent, legitimate interest. | No consent UI. Children are the main users. | Basis for minors is missing. |
| Delete within 90 days of cancellation; backups 30 days later. | No deletion tool was found. | Unverified promise. |
| Necessary cookies only, no tracking. | Google Fonts on the page. | Third-party request not disclosed. |
| Rights by email to `hej@acecourt.dk`, 30 days, complaint to Datatilsynet. | No in-product export or erasure. Email-only can be lawful; it is easy to miss. | **Lawyer** whether email-only is enough for a club SaaS. Engineering should still ship the admin tools above so a request is not a manual SQL hunt. |
| Terms cap liability at the last month’s fee and allow changes with 30 days’ email notice. | Not a technical finding. | **Lawyer.** |

The in-app guide (`/guide`) also disagrees with the shipped client: it says parents have no account and only get mail, and that players never see ratings. The parent dashboard is an account and shows level and XP. The policy should follow the shipped behavior, or the behavior should follow the guide. The owner’s rule is the guide: parents do not see level or ratings.

### DPA outline for clubs

There is no `/dpa` page and no template in this repo. Below is a heading list for counsel to turn into a contract. **Do not send it to a club as the agreement.**

1. Parties and roles (club and AceCourt ApS), and the controller/processor choice from the section above.
2. Subject matter and duration (the subscription; what happens at the 30-day notice in the terms).
3. Categories of data subjects: junior players, parents or guardians, coaches, club admins.
4. Categories of data: the inventory above, including evaluative scores and attendance.
5. Purpose: running training, informing parents of practical changes, coach-only development notes. Not advertising. Not selling data.
6. Documented instructions, and a ban on using children’s data to train public models.
7. Sub-processors: the table above, with a notice period before a new one is added.
8. International transfers: region of Supabase, Vercel, email, and fonts, plus the transfer tool counsel chooses.
9. Security measures: the header and RLS work in this document, access per club, encryption in transit, key handling.
10. Breach notice to the club, with a clock counsel sets.
11. Assistance with access, erasure, and complaints. Point at the export/erasure tool once it exists.
12. Deletion or return at the end of the contract, matching the backup reality.
13. Audit rights that do not require handing over other clubs’ data.
14. Liability, aligned with `/vilkaar` only after counsel edits both.

Effort: **Small** for engineering to attach the finished PDF and a sub-processor URL. The drafting is **Lawyer**.

### EU data residency

Not proven. The hostname `*.supabase.co` does not say the region. Vercel’s default region is not Denmark. Google Fonts leaves the EU.

Ask the owner to read, in the dashboards, and write the answers into the policy:

- Supabase project region for staging and for production (they are different projects; check both).
- Vercel function and asset region.
- Email provider region and whether message bodies are stored.
- Backups and PITR region.

Engineering follow-up if any of those are outside the EU and counsel wants them inside: move the Supabase project (a planned migration, staging first, not a flip on production), set the Vercel region, self-host fonts. Effort: **Large** if a database must move, **Small** if it is already in the EU and only the policy is wrong.

## Prioritized recommendations

Ordered for a club that holds children’s data. Effort is engineering size in the **real** Next.js repo unless noted. Calendar dates are intentionally not given.

| Priority | Item | Effort | Notes |
| --- | --- | --- | --- |
| 1 | Remove level, XP, AceCoins, and ratings from every parent surface, including email. | Small | Product rule. Do it on staging. Leave `/superadmin` alone. |
| 2 | Confirm server-side club isolation and the superadmin APIs. Add one cross-club test. | Medium | Do not probe production. |
| 3 | **Lawyer:** controller vs “data belongs to the club”, basis for minors, parental-consent text. Then store the consent row the lawyer specifies. | Medium once the text exists | Do not ship guessed consent copy. |
| 4 | Per-player export and erasure, staging fixture first. | Medium | Design above. |
| 5 | Rewrite `/privatliv` and `/vilkaar` to the real inventory, Google Fonts or their removal, the real vendors, and the real retention. Self-host fonts. | Small engineering, Lawyer for the words | |
| 6 | Security headers and a tight CORS allow-list on the Next.js app. | Small | Not in this Vite repo. |
| 7 | Rate-limit login, invite, reset, and calendar links. Hash parent tokens, short expiry, one child. | Medium | Live token format still unknown. |
| 8 | Stop logging personal data on the server. | Small | Legacy invite log is already removed in source. |
| 9 | Read Supabase, Vercel, and email regions. Publish the sub-processor list counsel approves. | Small to Large | Large only if a database must move. |
| 10 | DPA from the outline, counsel’s draft. | Lawyer | |
| 11 | Audit the Next.js lockfile. Disable the three legacy edge functions if that project is still online, and rotate its service-role key. | Small | Separate from staging. |
| 12 | Unique attendance and an XP ledger so a retry cannot mint XP. | Medium | Also the fairness fix in `docs/REVIEW.md`. Schema must stay compatible with superadmin inserts. |

## Lawyer checklist

Hand this list to counsel with the two public pages (`/privatliv`, `/vilkaar`) and the inventory table. Engineering should not close these by editing the policy alone.

- Controller and processor roles for the club and for AceCourt ApS.
- Lawful basis for each purpose, especially children’s data, evaluations, and the “at risk” flag.
- Whether a parent must consent, at what age, and what is stored as proof.
- Whether day-to-day parent UI may hide ratings while an access export must include them.
- Retention versus invoices, backups, and email logs.
- Whether email-only rights requests are acceptable, and the 30-day clock.
- Google Fonts and any future AI or email vendor as transfers.
- The DPA outline, liability cap, and the “data belongs to the club” sentence.
- Datatilsynet wording stays only if counsel keeps it.

## Verification

- `invite-member` no longer contains the email or the token in a log line. Response body still returns `token`.
- No migration, no `vercel.json`, no superadmin edit, no live data write.
- `npm audit --omit=dev` was read, not auto-fixed.
- Staging checks were unauthenticated GETs and previously downloaded public JavaScript. No child record was requested by id.
