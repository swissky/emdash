import { sql, type Kysely } from "kysely";

/** Durable idempotency ledger for plugin draft writes. */
export async function up(db: Kysely<unknown>): Promise<void> {
	await db.schema
		.createTable("plugin_content_operations")
		.ifNotExists()
		.addColumn("plugin_id", "text", (col) => col.notNull())
		.addColumn("collection", "text", (col) => col.notNull())
		.addColumn("entry_id", "text", (col) => col.notNull())
		.addColumn("operation_id", "text", (col) => col.notNull())
		.addColumn("request_hash", "text", (col) => col.notNull())
		.addColumn("revision_id", "text", (col) => col.notNull())
		.addColumn("expected_revision_id", "text")
		.addColumn("revision_data", "text", (col) => col.notNull())
		.addColumn("status", "text", (col) => col.notNull().defaultTo("pending"))
		.addColumn("created_at", "text", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.addColumn("updated_at", "text", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.addUniqueConstraint("plugin_content_operations_identity", [
			"plugin_id",
			"collection",
			"entry_id",
			"operation_id",
		])
		.execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
	await db.schema.dropTable("plugin_content_operations").ifExists().execute();
}
