import { sql, type Kysely } from "kysely";

/** Durable at-most-once attempt ledger for idempotent plugin emails. */
export async function up(db: Kysely<unknown>): Promise<void> {
	await db.schema
		.createTable("plugin_email_operations")
		.ifNotExists()
		.addColumn("source", "text", (col) => col.notNull())
		.addColumn("idempotency_key", "text", (col) => col.notNull())
		.addColumn("message_hash", "text", (col) => col.notNull())
		.addColumn("status", "text", (col) => col.notNull().defaultTo("claimed"))
		.addColumn("created_at", "text", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.addColumn("updated_at", "text", (col) => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.addUniqueConstraint("plugin_email_operations_identity", ["source", "idempotency_key"])
		.execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
	await db.schema.dropTable("plugin_email_operations").ifExists().execute();
}
