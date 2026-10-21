---
"emdash": minor
---

Checks the type of every `emdash()` option when Astro loads the config. A value of the wrong type, such as `mcp: "yes"`, `maxUploadSize: "10MB"` or `toolbar: "always"`, now fails the build with an error that lists each invalid option by its path. Before, these values were accepted without an error. An unrecognized top-level option still works as before, but EmDash now logs a warning that suggests the closest option name, so a typo such as `sitUrl` points to `siteUrl`.

If your build fails after upgrading, fix the option named in the error. For example, change `mcp: "true"` to `mcp: true`. Configurations that match the documented option types are not affected.
