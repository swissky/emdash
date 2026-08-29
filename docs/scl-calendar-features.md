# SCL calendar feature patch

This branch is a thin patch release based on the exact `emdash@0.35.0` tag. It adds only the three platform guarantees required by the SCL calendar plugin:

1. `ContentAccessWithWrite.createDraftRevision()` with optimistic concurrency and durable operation replay.
2. Atomic `KVAccess.setIfAbsent()` across in-process, Cloudflare sandbox, and workerd bridges.
3. Durable at-most-once email attempts through `EmailMessage.idempotencyKey`.

## Release contract

The tarball filename carries the `scl.N` patch revision while the package manifest retains the exact upstream version. This preserves compatibility with plugins whose peer range rejects prerelease versions. Build and validate from a clean worktree before producing tarballs:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm lint:quick
pnpm --filter emdash typecheck
pnpm --filter @emdash-cms/cloudflare typecheck
pnpm --filter @emdash-cms/sandbox-workerd typecheck
pnpm exec vitest run packages/core/tests/integration/plugins/capabilities.test.ts packages/core/tests/unit/plugins/email-pipeline.test.ts
pnpm exec vitest run packages/workerd/test/bridge-handler.test.ts
./scripts/pack-scl-calendar.sh ../scl-lauerz/vendor/emdash
```

## Updating upstream

Create a new branch from the desired official release tag, then cherry-pick the three feature commits from this branch in order. Renumber the two fork-only migrations after upstream's last migration if needed. A conflict is a required manual review, never bypass it. After all checks pass, increment the `scl.N` tarball revision, regenerate the tarballs, update the SCL lockfile, and run the SCL calendar and full verification suites.
