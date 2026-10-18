# APPLIED LEDGER fork:git@github.com:yokouchi-wildweb/next-vnx.git
- id:20260827-051935-fingerprint-basis | date:2026-10-18T00:00:00+09:00 | commit:c55e30a2 | notes:feature left disabled (default); db:push run by user after phase-4 merge
- id:20260827-234354-crud-replace-by-query | date:2026-10-18T00:00:00+09:00 | commit:c55e30a2 | notes:save domain regenerated (useReplaceByQuerySave added); no adoption yet
- id:20260904-012518-coupon-attribution-program | date:2026-10-18T00:00:00+09:00 | commit:c55e30a2 | notes:no downstream coupon handlers/consumers in this fork; db:push run by user
- id:20260912-013049-user-login-events-schema-registry | date:2026-10-18T00:00:00+09:00 | commit:c55e30a2 | notes:no local stopgap export existed; test:schema-registry pass; db:push run by user
- id:20260913-022556-user-login-event-logout | date:2026-10-18T00:00:00+09:00 | commit:c55e30a2 | notes:no downstream event-type consumers; enum value verified in DB
- id:20260914-010639-coupon-redeem-entry-scope | date:2026-10-18T00:00:00+09:00 | commit:c55e30a2 | notes:no downstream redeem entry points / forked signup forms in this fork
- id:20260930-061740-user-local-password-change-fix | date:2026-10-18T00:00:00+09:00 | commit:c55e30a2 | notes:no downstream newPassword callers; test:user-password-change 4/4 pass
- id:20260930-121656-bank-transfer-review-opt-in | date:2026-10-18T00:00:00+09:00 | commit:c55e30a2 | notes:fork does not use bank_transfer_inhouse (0 rows); kept upstream default disabled
