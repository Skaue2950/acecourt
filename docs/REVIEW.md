# AceCourt review

This is a review of what is actually deployed, not a claim that this Git repository is the product. No production data, production migrations, production environment variables, or production deploy settings were touched. The superadmin area was not changed.

## Environment map

| Surface | What it is | Data | Which branch in **this** repo |
| --- | --- | --- | --- |
| Production product | [https://www.acecourt.dk](https://www.acecourt.dk) (and `acecourt.dk` redirects there). Next.js on Vercel. | Its own Supabase project, separate from staging. | **None.** This repo does not contain that app. |
| Staging product | [https://acecourt-staging.vercel.app](https://acecourt-staging.vercel.app). Same Next.js product, a different build (different JS chunks, cached HTML about a day newer than production when checked). | A **different** Supabase project from production. | **None.** |
| Superadmin | `https://acecourt-staging.vercel.app/superadmin` in the staging app. Same Next.js app. | Staging database. Production was not opened. | **None.** |
| This repository | `Skaue2950/acecourt`. Vite + React + a Supabase SQL folder. One commit, 13 April 2026, by Jacob Skaue. | The public site [https://acecourt-eight.vercel.app](https://acecourt-eight.vercel.app) is this Vite app and talks to a **third** Supabase project. | `main` is the only branch. |

What is **not** in this repository:

- No `staging`, `develop`, or preview branch. `git branch -a` and the GitHub branch list contain only `main`.
- No `vercel.json`, no GitHub Actions, no split env files. `.env.example` is a single placeholder Supabase URL.
- `supabase/config.toml` is a local config with a placeholder JWT secret. It does not name a hosted project.
- The only GitHub deployment is from the Vercel bot on 13 April 2026. GitHub calls that environment `Production`. Its deployment URL is a Vercel URL on the `jacobs-projects` team and is behind Vercel SSO. That is the legacy Vite project, not `www.acecourt.dk` and not `acecourt-staging.vercel.app`.

Unclear, and left unresolved on purpose:

- The git branch of the **Next.js** repo that feeds staging, and the branch that feeds production. Those names are not in this repo and not in the public JS.
- Whether staging and production are two Vercel projects or two environments of one project. They use different databases and different builds. The staging hostname looks like a project’s own `*.vercel.app` alias, not a git preview URL (`*-git-staging-*.vercel.app`).
- Whether the manual script the app calls `lead-trainers.sql` has been applied on staging. The client only shows an error if an insert mentions a missing `lead_trainers` column.

Live checks were read-only and only on staging. Demo login could not be completed: `/demo` signs in with `NEXT_PUBLIC_DEMO_EMAIL` / `NEXT_PUBLIC_DEMO_PASSWORD`, and those are not set, so the page stops with “Demo-konto er ikke konfigureret endnu.” No attendance was saved, no rating was posted, no club was created.

## This repository is not the app on staging or production

`www.acecourt.dk` and `acecourt-staging.vercel.app` are a Next.js app (App Router, RSC headers, routes such as `/login`, `/trainer/dag`, `/spiller/dashboard`, `/foraeldre/dashboard`, `/admin/udvikling`, `/superadmin`).

This repo is a Danish gamification prototype: MDE scores, a six-skill radar, Pro Shop, and a landing page whose built HTML is what `acecourt-eight.vercel.app` serves. It has no CourtDNA dimensions, no parent portal, no superadmin, no season planner, and no “at risk” flag. `IMPLEMENTATION_SUMMARY.md` describes that prototype and overstates how finished it is.

Because the live source is not here, **nothing below was patched in application code.** A schema migration in this repo would change the legacy Vite database, not staging, and could be mistaken for a production migration. None was added and none was applied.

## Superadmin (read-only, do not change)

Staging route: `/superadmin`. It is a working cross-club console: search clubs, open a club, see teams and upcoming sessions, import players / parents / coaches, invite users, reset a password.

How access works today (client bundle only; not changed):

- It is **not** a `profiles.role`. The page reads the signed-in user and allows the screen only when that user’s id equals one id compiled into the page. Otherwise it sends the browser to `/dashboard`.
- While auth is still loading it does not redirect.
- It then loads every club with the browser Supabase client (`clubs` select `*`), and per club counts active players, profiles whose role is `trainer` or `admin`, active teams, and training sessions.
- It inserts players directly: `club_id`, `full_name`, `email`, `birth_year`, `age_category`, `level` (default 5), `xp` 0, `ace_coins` 0, `active` true.
- It calls `/api/superadmin/bulk-invite`, `/api/superadmin/reset-password`, `/api/invite`, and `/api/admin/import-foraeldre`.

Findings, noted only:

- The allowlist id is in the public staging JavaScript. Hiding the menu is not the protection. The Supabase policies and those four APIs have to reject every other user. That server side was not reviewed, because it is not in this repo, and it was not probed with a logged-in session.
- Password reset from this screen is powerful. Leave the route, the API, and the id check as they are.

Anything proposed later in this document is additive so this screen keeps working if the real repo adopts it:

- Do not rename or drop `clubs`, `players`, `profiles`, `teams`, `training_sessions`.
- Do not add a `NOT NULL` column without a default to those tables. Superadmin inserts do not send coach fields.
- Do not change `profiles.role` values `admin`, `trainer`, `player`, `parent`, and do not make superadmin depend on a new role.
- Do not change `/superadmin` or the four APIs above.
- New coach-link tables are invisible to this screen because it never reads them. `select *` on teams and sessions keeps working if columns are only added.

## Yardstick

| Owner requirement | Today | Gap | Fixed here |
| --- | --- | --- | --- |
| 1. Club administration is the product | The live app is built around clubs, courts, season planning, CSV import, teams, messages, and cancellations. The public guide at `/guide` walks a club from signup to the first session. | Coach coverage of several courts is name-based and half-migrated (below). This repo does not do this job. | Not fixed. Source is not in this repo. |
| 2. Flag burnout / quit risk for the club and the coach | Admins have `/admin/udvikling`. Flags returned by `/api/admin/udvikling`: `churn` (“Fraværsrisiko”), `lowAttendance`, `declining`, `stagnating` (copy: level almost unchanged for 8+ weeks), `readyUp`, plus `reviewDue` (no development review for 8+ weeks). The “Risiko” filter is `churn OR lowAttendance OR declining`. Unauthenticated call returns 403 `Kun admin`. | The formula is server-side and not in this repo, so attendance trend vs rating trend vs XP silence cannot be checked. The page is admin-only in the client, so the coach on court does not get the list. XP is not named in the flags. | Not fixed. |
| 3. XP is motivating, fair, and not gameable | Player home reads `players.xp`, `level`, `ace_coins`. Next level is `500 - (xp % 500)` (500 XP per band). Attendance is awarded by `POST /api/attendance`, which returns `xp_awarded`. The client does not send an XP amount. A second coach rating the same player is rejected: “allerede vurderet i denne træning af en anden træner.” | Idempotency of that XP award is not visible. The attendance screen does not load saved attendance, so a second save can change who was present. Marketing numbers (about 690 XP, level 7, 340 XP to level 8) do not match the 500 XP band in the player client. | Not fixed. |
| 4. Parents see focus and practical info only. Ratings stay coach-only | The guide says players never see ratings and parents get mail without an account. The player home shows XP, level, coins, and calls `/api/spiller/fokus` for `focus` (and `review`). Player UI strings do not show dimension scores. | **Parent portal leaks level and economy.** See below. CourtDNA scores are wired into that same page. Email templates were not in any public bundle, so they were not audited. | Not fixed. |
| 5. Phone: attendance + rating of the whole team in under a minute | The guide describes the right flow: today, everyone present except reported absences, one tap, auto-save, then form and dimensions. | The attendance and quick-rating screens that are actually shipped do not match that promise. Demo login is off, so a phone pass of the real flow could not be completed. | Not fixed. |
| Several coaches, several courts, substitute can take a court | `teams` has `trainer_name`, `co_trainers[]`, and optional `lead_trainers[]`. `isCoach` is true if the user’s **name** equals `trainer_name` or sits in either array. | A coach only sees named teams. Same-slot “pick up another court” was not found. Attendance has no author. Ratings reject the second coach instead of recording them. `lead_trainers` is a manual SQL step. | Not fixed. Proposal is backward compatible with superadmin. |

## Parent and player surfaces

`/foraeldre/dashboard` is wrapped in `allowedRoles: ["parent"]`. On load it queries:

- `players`: `id, full_name, level, age_category, xp, ace_coins`
- `team_members` → `teams(*)`
- `attendance`: `session_id, present` (then a lifetime present percentage)
- `training_updates`: `select *` for upcoming rows

It renders four stats: **Niveau**, **Total XP**, **AceCoins** (“Bruges i shop”), and **Hold**, with the subtitle `{500 - xp % 500} til næste level`. It also renders a card **“CourtDNA — seneste vurdering”** and, when ratings exist, each dimension as `score/5`. The array that feeds that card is filled from `Promise.resolve({data: []})`, so today the card falls through to “Ingen vurderinger endnu.” The screen is still built to show scores, and level / XP / AceCoins are real data, not a stub.

That breaks the parent rule. Parents may see a short focus sentence and practical updates (cancellation, new court, next session, the absence button “Meld afbud”). They should not see level, XP, AceCoins, attendance-as-a-grade, or any dimension score.

The player home is allowed to show XP, level, and coins. It should keep “Dit fokus” and must not grow a score chart. `review` is requested from `/api/spiller/fokus` and, in the bundle that was read, only stored. Confirm the API does not put dimension scores in `review` or in the focus string. An unauthenticated GET returned `{"focus": null}` and no player row.

Emails and magic links were not in the client bundles. Audit the send path in the real repo before calling this done: cancellation, court move, coach message, and focus text only.

`training_updates` is loaded with `select *` on the parent page. If a row can hold an internal note, parents receive it even when the UI only prints `message` and `new_court`. Select the public columns.

## At-risk signal

What the admin UI already promises is the right shape: a list, not a score the parent sees.

| Flag | Label in the UI | Hint shown to the admin |
| --- | --- | --- |
| `readyUp` | Klar til stærkere hold | Strong recent ratings and good attendance |
| `stagnating` | Stagnerer | Level almost unchanged for more than 8 weeks |
| `churn` | Fraværsrisiko | Grouped under Risiko |
| `lowAttendance` | Lavt fremmøde | Grouped under Risiko |
| `declining` | Faldende udvikling | Grouped under Risiko |
| `reviewDue` | Vurdering forfalden | No development review for 8+ weeks |

Risiko is the union of churn, low attendance, and declining form. The thresholds live in `/api/admin/udvikling`, which this repo does not contain.

Proposed rule, still coach-only, so it can be checked on staging before production:

- **Absence:** two reported absences in a row, or attendance under about 60% over the last four completed sessions the player was selected for.
- **Drop-off:** present and active, then no attendance and no absence report for 14 days while the team kept training.
- **Form:** club dimensions trending down across the last three rated sessions (for example average down by 1 point, or two dimensions down). Do not alert on a single 3.
- **Stall:** no upward move for 8 weeks, which the UI already describes. Offer a new focus or a new team, not a warning to the family.
- **Engagement:** XP only as a weak extra signal (no attendance XP for 3 sessions). Never alert on low XP alone. Juniors who are new or injured would look “unmotivated.”
- **One list for the coach** of the players on today’s teams, with the reason in one sentence (“3 absences in 4 weeks”), and a link to the focus note. Admins keep the full club list they have now.
- Recompute when attendance or a rating is saved. Do not email parents about the flag.

## XP

Live client rules that are visible:

- Stored on `players.xp`, `players.level`, `players.ace_coins`.
- Display band is 500 XP. The legacy prototype in this repo uses `floor(sqrt(xp / 100))` and never awards coins. Those formulas are not the live product. Do not “unify” them.
- Attendance XP is decided by the server (`xp_awarded` in the response).
- The attendance screen starts with **every loaded player marked present**, then POSTs `present_player_ids` and `absent_player_ids`. It does not read existing `attendance` rows first. Reported absences are therefore not pre-unchecked on this screen, despite the guide. A reload or a second coach starts from “everyone present” again and can overwrite the first save.
- If the team has no members, the same screen loads **every active player in the club** and marks them present. That is a bad default for a substitute.
- Quick Rating posts one player/dimension to `/api/trainer/ratings`. A second trainer is blocked for that player in that session. There is no `rated_by` in the client payload. Blocking a double rating is safer than adding XP, but a substitute cannot correct a wrong score, and the club cannot see who entered it.

What “not gameable” should mean on staging, then production:

- One attendance credit per player per session. Unique key `(session_id, player_id)`. Re-saving the same status awards 0. Changing present → absent claws the XP and the coins back. If coins were already spent, record a debt and take it from the next grant instead of going negative or minting the coins again.
- Absent, excused, and cancelled sessions award 0. Do not pay XP for a rating.
- The server computes the amount. Ignore any XP number from the browser.
- Store `recorded_by` and `recorded_at` on the attendance row and on each rating.
- Reject awards for sessions that have not started, and do not award the coach’s own player row when they tap save.
- Level-up copy in the marketing page should use the same 500 XP band as the player home.

## Several coaches on several courts

What exists:

- A team can name one lead (`trainer_name`) plus `co_trainers`. More than one lead is written to `lead_trainers` only when that list has more than one name. If the column is missing, import throws and tells the operator to run `lead-trainers.sql` by hand. Multiple leads are not a completed, automatic migration.
- Membership is a **display name**, not a user id. Two coaches with the same name collide. Renaming a coach drops them off every team. Attribution cannot be trusted.
- A trainer’s “today” query loads the club’s teams for that weekday and keeps rows where `isCoach(team, user.name)` is true. Teams they are not named on are hidden. An admin sees the unfiltered list.
- The season builder assigns a single `coachId` onto each court slot.
- Attendance lists the club’s latest sessions (`training_sessions` by `club_id`, limit 20), not “my courts today,” and not other courts in the same hour.
- Two coaches saving attendance is last HTTP POST wins, and the payload is the full present/absent set from a screen that was not synced with the other coach.
- Two coaches rating is “first rating sticks.”

That does not meet (a)–(e).

Proposed model, staging first, superadmin-safe because it only adds tables and nullable columns:

- `team_coaches(team_id, profile_id, role)` with `role` in `lead` | `assistant`. Keep `trainer_name`, `co_trainers`, and `lead_trainers` as a mirrored cache so current reads and the CSV import keep working. Fill the table from those names once, then write both until the old columns can be retired in a later production change.
- `session_staff(session_id, profile_id, role)` with `role` in `lead` | `assistant` | `substitute`. Adding yourself for today is how a coach picks up another court in the same time slot. It does not rewrite the team’s permanent coaches.
- Attendance unique on `(session_id, player_id)`, with `status`, `recorded_by`, `recorded_at`. Upsert. XP ledger unique on `(session_id, player_id)`.
- Ratings unique on `(session_id, player_id, dimension)`, with `score`, `recorded_by`, `recorded_at`. The coach on the court may update the row; the previous score stays in `rating_revisions` so two coaches do not create two XP events and the club can see who changed what. Do not hard-block the substitute.
- Today, on the phone: sessions where I am on `session_staff` or on `team_coaches`, plus a short “Andre baner kl. 16” list that only inserts `session_staff`. Default everyone present except rows already `absent`. One save. Then the same players for form + dimensions, default “som vanligt” (3) only where a previous score exists, unset where it does not, so a new player is not silently graded 3.
- Permissions, club-scoped, unchanged for superadmin: a coach reads and writes attendance and ratings for sessions in **their** club, and reads CourtDNA for players in that club. An admin does that plus settings, import, and coach assignment. Neither role reads another club. Parents and players do not receive rating rows. Superadmin keeps using its own id check and its current queries.

No migration file is in this pull request. Applying one from this repo would hit the wrong database.

## Mobile

Checked on staging without an account: the marketing page stacks at a narrow width, and `/login` is a single column. That is not the coach flow.

The shipped attendance success state uses `padding: 60px 40px` and a 64px icon. Quick Rating is “pick a player, pick a dimension,” one POST per score, not a pass through the team. Neither screen is what the guide promises, and neither was timed on a 360×640 or 390×844 phone because the demo user is not configured.

The flow that would make one minute realistic: open Today, tap the court, absences already off, tap the exceptions, save once (retry the same payload if the network drops; the unique key makes the retry safe), then one player at a time with large 1–5 targets and next/previous. Keep drafts in `sessionStorage` so a reload does not reset everyone to present.

## Legacy code in this repository

These issues are real in **this** Vite project and on `acecourt-eight.vercel.app` if that database is still used. They are **not** the bugs on `www.acecourt.dk` or staging. They were not changed, because `main` is the only branch and GitHub/Vercel already labels a deploy of it as Production for that old project. A half-applied security patch there would not help clubs and is the wrong schema.

Critical if that old database is still reachable:

- `process-xp`, `assign-role`, and `invite-member` use the service role and do not check the caller. XP can be granted repeatedly. `assign-role` can grant `admin`. The function also writes `profiles.level`, which the migration defines as a generated column, so the update fails or fights the formula `floor(sqrt(xp / 100))`.
- `profiles` update policy lets a user write `xp`, `ace_coins`, and `club_id`.
- `purchaseItem` inserts inventory and never spends coins. The shop call passes the arguments in the wrong order.
- `joinClub` lets the client choose `coach`. Club create/join also cannot succeed under the written RLS (no insert policy, and the first admin cannot insert their own role). The signup trigger inserts the generated `level` column, which PostgreSQL rejects.
- RLS on `user_roles` queries `user_roles` again (recursion risk). Many tables have RLS and no policies, so they are denied. `player_skills` coach check is not tied to the same club.

High:

- MDE sliders go to 10. The check constraint is 1–5, so a normal save fails. There is no CourtDNA.
- Attendance is one request per player, for every club player, with no roster and no XP call from the UI.
- Re-saving attendance has no ledger.

Medium and low: route guards call `navigate` during render; level progress math returns the band width instead of the XP remaining; i18n is mostly hardcoded Danish; admin dashboard counts are zeros; challenge and shop rows are global rather than per club; several coach components and hooks are unused.

## What would make clubs buy

The live product already sells the right job: a club plans the season, a coach runs the court from a phone, parents stay informed without an account, and the club can see who is ready to move up and who is slipping. The gaps that will show up in a pilot are the ones in this review: a parent who can see level and CourtDNA, a substitute who cannot take a court safely, XP that might pay twice, and an “at risk” list the coach never sees. Closing those, on staging, with the superadmin screen left as it is, is the difference between a convincing demo and a tool a club will trust with its juniors.

## What was fixed in this pull request

No application code, schema, route, permission, or superadmin behavior was changed. The live app’s source is not in this repository, there is no staging branch to target, and a migration here would not be staging-first for the real database.
