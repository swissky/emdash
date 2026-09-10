---
"emdash": minor
---

Adds original-file tracking to media items. Upload flows can now record the untouched source file (`originalStorageKey`, `originalMimeType`, `originalSize`, `originalWidth`, `originalHeight`) alongside the rendered version when confirming an upload, and the original is cleaned up together with the rendered file when the media item is deleted or an abandoned upload expires. Existing media items are unaffected; the new fields stay empty until an upload provides them.
