import { describe, expect, it } from "vitest";

import {
	unknownOptionWarning,
	validateConfigShape,
} from "../../../../src/astro/integration/config-schema.js";
import { emdash } from "../../../../src/astro/integration/index.js";
import { local } from "../../../../src/astro/storage/adapters.js";
import { sqlite } from "../../../../src/db/adapters.js";

function build(config: unknown) {
	// @ts-expect-error - runtime validation covers untyped JavaScript configuration
	return () => emdash(config);
}

describe("emdash() config validation", () => {
	it("accepts a typical configuration", () => {
		expect(() =>
			emdash({
				database: sqlite({ url: "file:./data.db" }),
				storage: local({ directory: "./uploads", baseUrl: "/_emdash/api/media/file" }),
				plugins: [{ id: "audit-log", version: "1.0.0", entrypoint: "audit-log" }],
				mcp: false,
				maxUploadSize: 100 * 1024 * 1024,
				toolbar: "client",
				fonts: false,
				admin: { siteName: "Agency CMS", footerLabel: false },
			}),
		).not.toThrow();
	});

	it.each([
		["mcp", { mcp: "yes" }],
		["maxUploadSize", { maxUploadSize: "10MB" }],
		["toolbar", { toolbar: "always" }],
		["database", { database: "file:./data.db" }],
		["plugins", { plugins: ["audit-log"] }],
		["admin.siteName", { admin: { siteName: 42 } }],
		["fonts", { fonts: { scripts: "arabic" } }],
	])("names the option path for a wrong %s value", (path, config) => {
		expect(build(config)).toThrow(`→ at ${path}`);
	});

	it("reports every invalid option at once", () => {
		expect(build({ mcp: "yes", toolbar: "always" })).toThrow(/at mcp[\s\S]*at toolbar/);
	});

	it("returns unknown top-level options instead of failing", () => {
		expect(build({ sitUrl: "https://example.com" })).not.toThrow();
		expect(validateConfigShape({ sitUrl: "https://example.com", mcp: true })).toEqual(["sitUrl"]);
	});

	it("suggests the closest option for a misspelled key", () => {
		expect(unknownOptionWarning("sitUrl")).toBe(
			"Unknown EmDash config option `sitUrl` is ignored. Did you mean `siteUrl`?",
		);
		expect(unknownOptionWarning("somethingElse")).toBe(
			"Unknown EmDash config option `somethingElse` is ignored.",
		);
	});
});
