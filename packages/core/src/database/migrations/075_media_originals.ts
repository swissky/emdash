import type { ColumnDataType, Kysely } from "kysely";

import { columnExists } from "../dialect-helpers.js";

const COLUMNS = [
	["original_storage_key", "text"],
	["original_mime_type", "text"],
	["original_size", "integer"],
	["original_width", "integer"],
	["original_height", "integer"],
] as const satisfies ReadonlyArray<readonly [string, ColumnDataType]>;

const DUPLICATE_COLUMN_RE = /(?:duplicate column|column .* already exists|already exists.*column)/i;

export async function up(db: Kysely<unknown>): Promise<void> {
	// One ALTER per column (SQLite limitation), each skippable so the
	// migration is restartable after any completed statement.
	for (const [column, type] of COLUMNS) {
		if (await columnExists(db, "media", column)) continue;
		try {
			await db.schema.alterTable("media").addColumn(column, type).execute();
		} catch (error) {
			if (DUPLICATE_COLUMN_RE.test(deepErrorMessage(error))) {
				if (await columnExists(db, "media", column)) continue;
			}
			throw error;
		}
	}
}

export async function down(db: Kysely<unknown>): Promise<void> {
	for (const [column] of COLUMNS.toReversed()) {
		if (await columnExists(db, "media", column)) {
			await db.schema.alterTable("media").dropColumn(column).execute();
		}
	}
}

function deepErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		const own = error.message ?? "";
		if (error.cause) {
			const causeMessage = deepErrorMessage(error.cause);
			return own ? `${own}: ${causeMessage}` : causeMessage;
		}
		return own;
	}
	if (typeof error === "string") return error;
	try {
		return JSON.stringify(error);
	} catch {
		return String(error);
	}
}
