import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const members = sqliteTable('members', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	pinHash: text('pin_hash').notNull(),
	mustChangePin: integer('must_change_pin', { mode: 'boolean' }).notNull().default(true),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`),
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(datetime('now'))`)
});

export const events = sqliteTable('events', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	installmentAmountCents: integer('installment_amount_cents').notNull(),
	numInstallments: integer('num_installments').notNull().default(1),
	startDate: text('start_date').notNull(),
	endDate: text('end_date'),
	active: integer('active', { mode: 'boolean' }).notNull().default(true),
	isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`)
});

export const wallets = sqliteTable('wallets', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	initialBalanceCents: integer('initial_balance_cents').notNull().default(0),
	isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`)
});

export const walletMovements = sqliteTable('wallet_movements', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	walletId: integer('wallet_id')
		.notNull()
		.references(() => wallets.id),
	eventId: integer('event_id').references(() => events.id),
	memberId: integer('member_id').references(() => members.id),
	receiptId: integer('receipt_id').references(() => paymentReceipts.id),
	transferGroupId: text('transfer_group_id'),
	type: text('type', { enum: ['credit', 'debit'] }).notNull(),
	amountCents: integer('amount_cents').notNull(),
	description: text('description').notNull(),
	movementDate: text('movement_date').notNull(),
	runningBalanceCents: integer('running_balance_cents').notNull().default(0),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`)
});

export const paymentReceipts = sqliteTable('payment_receipts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	memberId: integer('member_id')
		.notNull()
		.references(() => members.id),
	eventId: integer('event_id')
		.notNull()
		.references(() => events.id),
	amountCents: integer('amount_cents').notNull(),
	transferDate: text('transfer_date').notNull(),
	message: text('message'),
	filePath: text('file_path').notNull(),
	status: text('status', { enum: ['pending', 'approved', 'rejected'] })
		.notNull()
		.default('pending'),
	reviewedAt: text('reviewed_at'),
	createdAt: text('created_at')
		.notNull()
		.default(sql`(datetime('now'))`)
});

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Wallet = typeof wallets.$inferSelect;
export type NewWallet = typeof wallets.$inferInsert;
export type WalletMovement = typeof walletMovements.$inferSelect;
export type NewWalletMovement = typeof walletMovements.$inferInsert;
export type PaymentReceipt = typeof paymentReceipts.$inferSelect;
export type NewPaymentReceipt = typeof paymentReceipts.$inferInsert;
