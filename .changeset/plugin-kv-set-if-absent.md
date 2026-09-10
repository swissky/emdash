---
"emdash": minor
"@emdash-cms/cloudflare": minor
"@emdash-cms/workerd": minor
---

Adds `ctx.kv.setIfAbsent(key, value)` for plugins: an atomic write that stores the value only when the key does not exist yet and returns whether it won. Available in-process and in sandboxed plugins on both Cloudflare and workerd runtimes, enabling one-time initialization and claim-style locks without read-modify-write races.
