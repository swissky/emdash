---
"emdash": minor
---

Adds `ctx.content.createDraftRevision()` for plugins with content write access: a draft-only write that never touches the published version of an entry.

Each returned `ContentItem` now carries a `draftRevisionId` token. Pass it back as `expectedDraftRevisionId` to make the write conditional (the call fails when someone else changed the draft in between), and set a stable `operationId` to make retries after a lost response idempotent — a replayed call is acknowledged without creating a second revision. Plain `create`/`update`/`delete` behave exactly as before.
