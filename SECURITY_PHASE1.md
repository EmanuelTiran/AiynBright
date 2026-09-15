# Security foundation — phase 1

## Configuration and deployment

- `MONGO_URI` is required. The existing cached Mongo connection and retry-on-failure behavior are preserved. There is no connection-string fallback.
- `JWT_SECRET` is required and must contain at least 32 characters. Use a cryptographically random secret, stored only in the deployment environment or a secret manager. The former `SESSION_SECRET` setting is no longer used. The ignored local `.env` JWT signing secret was regenerated during this remediation; it is not a production credential.
- Session tokens last eight hours and contain only `sub`, `email`, and standard issuer, audience and time claims. Tokens from the old implementation are rejected: users must log in again after deployment.
- The session cookie remains `ayinbright_session`, with HttpOnly, SameSite=Lax, Path=/, eight-hour Max-Age, and Secure in production. Logout expires that cookie. Production requires HTTPS.
- Rotate **any MongoDB credentials previously committed to Git externally**, even though the current connection code contains no credential fallback. Removing source text does not revoke a credential or remove it from history. No history rewrite was performed.
- The ignored local `.env` also contains a Google OAuth client-secret setting and a legacy admin-password setting. These were not copied or printed. Rotate them externally if previously shared or committed. `PASSWORD_ADMIN` is no longer used by active authentication. Abandoned NextAuth/Supabase integrations remain inactive.

## Authentication and administrators

Signup validates name, normalized email and password on the server. New passwords require 8–128 characters, including a letter and number. Login accepts nonblank legacy plaintext passwords up to 128 characters, so historical short passwords can still migrate. New model documents require a valid hash and have no default password. Model validation rejects new or modified legacy password fields, even if a valid hash is also supplied. The creation controller rejects plaintext and allowlists name, email and hash.

Every authenticated data access resolves the JWT subject to a current MongoDB user. A missing/deleted user is unauthenticated. Token email and role claims never select a database target or grant administrator permission. The shared role check uses the current database `role: "admin"`; removing that role takes effect on the next request.

`ADMIN_EMAILS` remains a case-insensitive comma-separated signup reservation list. Email alone no longer grants admin privileges: an old account with that email might have been registered by somebody else. Before deployment, verify ownership of each intended administrator account out of band, then have a trusted database operator assign `role: "admin"` to its verified `_id`. Do not promote accounts simply because their email matches the environment list. No user was promoted and no live database was modified by this task.

## Password migration

1. If `passwordHash` exists, verify it as a hash. A wrong or malformed hash fails without falling back to the legacy plaintext field. Recheck the current database hash after the asynchronous comparison; deletion or a concurrent credential change fails the login attempt.
2. If only `password` exists and holds a bcrypt hash, compare with bcrypt, never by comparing the hash text as a password.
3. Otherwise compare the supplied password to legacy plaintext using a timing-safe comparison for equal-length inputs.
4. After a successful legacy comparison, calculate a bcrypt hash with cost 12, then conditionally update the same `_id` only while the original legacy password and absence of a hash still match. Set `passwordHash` and unset `password` in one MongoDB update. Issue a session only after that update succeeds. On a concurrent password change or migration, fail that attempt safely; the user can retry.

Passwords over [bcryptjs's 72-byte input limit](https://github.com/dcodeIO/bcrypt.js/) use the explicit `bcrypt-sha256:v1:` representation: SHA-256 of the UTF-8 password, base64-encoded, then salted bcrypt at cost 12. Only the resulting bcrypt hash and its format prefix are stored. This preserves all characters, including long Unicode plaintext legacy passwords. The earlier `bcrypt-sha256:` representation remains readable; unknown versions fail closed.

Shorter inputs use standard bcrypt. **An over-72-byte candidate is rejected for a standard bcrypt hash**, because that hash cannot distinguish suffixes beyond byte 72. Existing standard bcrypt accounts with passwords of at most 72 bytes remain compatible. Historical longer passwords already stored as ordinary bcrypt need a trusted password reset; accepting them would also accept different passwords sharing the same prefix. Malformed hash-looking legacy values require account review/recovery.

### One-time migration tool

The canonical Node-only password implementation is shared by the application's `server-only` wrapper and `scripts/migrate-legacy-passwords.mjs`. The script never automatically loads `.env`. Intentionally supply `MONGO_URI` through the chosen environment/secret manager and replace `YOUR_VERIFIED_DATABASE` with the database you have verified:

```powershell
npm.cmd run migrate:legacy-passwords -- --database YOUR_VERIFIED_DATABASE --dry-run
npm.cmd run migrate:legacy-passwords -- --database YOUR_VERIFIED_DATABASE --apply
```

Omitting the mode defaults to dry-run. Omitting the database, supplying conflicting modes or unknown arguments fails. The explicit database overrides any URI default. Dry-run reads counts/candidates without writing records or creating indexes/collections. Apply streams only legacy plaintext strings without a new hash, hashes sequentially at cost 12, and conditionally sets the hash and unsets plaintext with majority write acknowledgement. Each update matches `_id`, the original plaintext and absence of a new hash; concurrent changes are counted as conflicts, never overwritten. Rerunning is safe because migrated documents no longer match.

The script outputs only numeric counts: scanned, eligible, wouldMigrate, migrated, conflicts, skipped, failed and remaining. A driver/write error stops the run and increments failed without printing error details. Exit status is nonzero for failures, conflicts, skipped unusable passwords, or eligible records still remaining after apply. Use the exit status as well as the counts; remaining may be zero when a failure prevented the final count query.

The script deliberately excludes hash-looking legacy values and records already containing `passwordHash`. A trusted operator must review malformed/unsupported credentials and any records containing both fields, and complete verified cleanup/reset as needed. Existing plaintext remains a security issue until migration/cleanup is deliberately completed. Back up the selected database, exercise the tool on staging, then review a dry-run before an intentional production run. **This review did not run either migration mode against any live database.**

## User data and mutation APIs

- `POST /api/updateUser` accepts exactly `{ updateData }`. Updates are scoped to the current user's database ID. Exactly one of `colorWeaknesses`, `sizeWeaknesses`, or `fieldWeaknesses` may be replaced per request, with at most 500 entries and explicit per-entry validation. Unknown top-level/nested fields, prototype keys (including `__proto__`) and MongoDB operators are rejected. Existing result IDs and ISO dates remain supported.
- `DELETE` or `POST /api/deleteWeakness` accepts `{ field, index, email? }`. The index is a nonnegative safe integer bounded by the actual result array's length, including historical collections over 500 entries. Without a target email it deletes the current user's result. A different email requires current database administrator status before the target is looked up. Admin table requests retain their existing shape.
- Both endpoints require JSON and reject browser requests marked cross-site. They expose no cross-origin CORS permission. The cookie's SameSite setting also constrains cross-site requests.
- Database projections, model JSON/object transforms and explicit user/result DTO allowlists prevent passwords and hashes from entering profile/vision/admin props or deletion responses. The obsolete, unreferenced `server/auth.js` implementation was removed. The two manual Phase 1 edits to `repomix-output.xml` were reversed during final review; that file is unchanged from the pre-Phase-1 snapshot and is not executable application code. Its historical fallback example must not be reused.
- Authentication/database failures return generic messages without logging credential-bearing error objects.

## Verification

Run `npm run test:security`, `npm run lint`, and `npm run build` (use `npm.cmd` in PowerShell when execution policy blocks `npm.ps1`). The security suite uses Node's built-in test runner, the real bcrypt/JWT/Zod/model schemas, mocked database I/O and a test-only Next request-context adapter. It exercises registration, plaintext/hash migration, failed/racing migration, wrong passwords, long passwords, JWT verification, cookie/logout behavior, update/deletion authorization, admin revocation, DTO serialization, and Mongo connection configuration/caching.

The final-review suite contains 29 passing tests, including migration dry-run/idempotence/conflicts/failures, real Mongoose query-projection inspection, model write guards, bcrypt boundary cases, credential-change races and adversarial API/token cases. Lint and the production build pass. The restricted build failed only to download the existing Google font; the approved network-enabled retry passed. The final generated client bundles contain no server-secret variable references, bcrypt format markers or Mongoose references. These tests do not establish live database connectivity or validate actual MongoDB writes.

A temporary production server also passed signed-out HTTP checks for `/`, `/login`, `/signin`, `/user`, `/admin`, `/blur`, `/blur/diagnosis`, `/blur/improve`, `/color`, and `/field`. Admin access was denied and both mutation APIs returned 401 without a session. Generated client bundles contained no server-secret variable references. The temporary server was stopped. The requested source/snapshot searches and final diff review were completed; `git diff --check` passed.

Manual staging verification still required: signup and inspect the stored hash; login a seeded legacy account and inspect the removed plaintext field; login/logout/profile; blur diagnosis/improvement; color and field tests; save/reload/delete each result type; verify admin listing/deletion with a reviewed admin and denial with a normal account; inspect browser cookies and network/RSC responses for credential absence. Use staging accounts, not production user records.

Deferred: login rate limiting, email verification/recovery, MFA, individual stolen-session revocation, and concurrent full-array result editing. Execution of the supplied legacy migration and any exceptional-account cleanup are manual deployment actions. Logout clears this browser's cookie; a copied token remains valid until its eight-hour expiry or signing-key rotation. No authentication-framework migration, UI redesign, dependency upgrade, commit, or push was performed.

### Secret scan classification

- No new real credential literals were found by the tracked-file pattern scan or the inspected Word XML scan. This is a scoped scan, not proof that Git history, backups or compressed PDF contents contain no historical secrets.
- Active `JWT_SECRET`, `MONGO_URI` and revalidation references are environment lookups. Commented Google/Supabase references are inactive environment references.
- Tests use synthetic credentials and random ephemeral signing keys, with fake database I/O.
- `123` in exercise characters/CSS and the product name are false positives. The old constant in the generated snapshot is a known insecure historical fallback, not an active signing secret.

Keep this file as project security/deployment documentation. It records operational requirements and migration commands needed to deploy the code safely.
