import Database from "better-sqlite3";
import { Kysely, SqliteDialect, sql } from "kysely";
import { afterEach, beforeEach, expect, it } from "vitest";

import * as originals from "../../../src/database/migrations/075_media_originals.js";
import { runMigrations } from "../../../src/database/migrations/runner.js";
import type { Database as DatabaseSchema } from "../../../src/database/types.js";

let sqlite: Database.Database;
let db: Kysely<DatabaseSchema>;

beforeEach(() => {
	sqlite = new Database(":memory:");
	db = new Kysely<DatabaseSchema>({ dialect: new SqliteDialect({ database: sqlite }) });
});

afterEach(async () => {
	await db.destroy();
});

it("adds nullable original metadata without changing existing media", async () => {
	await runMigrations(db);
	await originals.down(db);
	await sql`
		INSERT INTO media (id, filename, mime_type, storage_key)
		VALUES ('existing', 'existing.webp', 'image/webp', 'existing.webp')
	`.execute(db);

	await originals.up(db);

	const row = sqlite
		.prepare(
			`SELECT storage_key, mime_type, original_storage_key, original_mime_type,
				original_size, original_width, original_height FROM media WHERE id = ?`,
		)
		.get("existing");
	expect(row).toEqual({
		storage_key: "existing.webp",
		mime_type: "image/webp",
		original_storage_key: null,
		original_mime_type: null,
		original_size: null,
		original_width: null,
		original_height: null,
	});
});
