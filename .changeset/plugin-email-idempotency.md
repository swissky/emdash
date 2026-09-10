---
"emdash": minor
"@emdash-cms/cloudflare": minor
---

Adds `cc`, `replyTo`, and `idempotencyKey` fields to plugin email messages.

Plugins calling `ctx.email.send()` can now CC additional recipients and set a Reply-To address; the Cloudflare Email Sending provider forwards both. Passing an `idempotencyKey` makes the send at-most-once: retries of the same key (for example after a lost response) are acknowledged without sending a second email. Sends without an `idempotencyKey` behave exactly as before.
