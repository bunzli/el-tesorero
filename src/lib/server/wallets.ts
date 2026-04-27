import { db } from './db/index.js';
import { walletMovements, wallets } from './db/schema.js';
import { eq, asc } from 'drizzle-orm';
import { randomBytes } from 'crypto';

/**
 * Recalculates running balances for all movements in a wallet
 * starting from a given date. Must be called within the same
 * transaction as the insert/update/delete that changed movements.
 */
export function recalculateRunningBalances(walletId: number, fromDate?: string) {
	const wallet = db.select().from(wallets).where(eq(wallets.id, walletId)).get();
	if (!wallet) return;

	const allMovements = db
		.select()
		.from(walletMovements)
		.where(eq(walletMovements.walletId, walletId))
		.orderBy(asc(walletMovements.movementDate), asc(walletMovements.id))
		.all();

	let balance = wallet.initialBalanceCents;

	for (const mov of allMovements) {
		if (mov.type === 'credit') {
			balance += mov.amountCents;
		} else {
			balance -= mov.amountCents;
		}

		if (mov.runningBalanceCents !== balance) {
			db.update(walletMovements)
				.set({ runningBalanceCents: balance })
				.where(eq(walletMovements.id, mov.id))
				.run();
		}
	}
}

export function createMovement(data: {
	walletId: number;
	type: 'credit' | 'debit';
	amountCents: number;
	description: string;
	movementDate: string;
	eventId?: number | null;
	memberId?: number | null;
	receiptId?: number | null;
	transferGroupId?: string | null;
}) {
	const result = db
		.insert(walletMovements)
		.values({
			walletId: data.walletId,
			type: data.type,
			amountCents: data.amountCents,
			description: data.description,
			movementDate: data.movementDate,
			eventId: data.eventId ?? null,
			memberId: data.memberId ?? null,
			receiptId: data.receiptId ?? null,
			transferGroupId: data.transferGroupId ?? null,
			runningBalanceCents: 0
		})
		.returning()
		.get();

	recalculateRunningBalances(data.walletId);
	return result;
}

export function createTransfer(data: {
	fromWalletId: number;
	toWalletId: number;
	amountCents: number;
	description: string;
	movementDate: string;
}) {
	const groupId = randomBytes(8).toString('hex');

	const debit = createMovement({
		walletId: data.fromWalletId,
		type: 'debit',
		amountCents: data.amountCents,
		description: `Transferencia: ${data.description}`,
		movementDate: data.movementDate,
		transferGroupId: groupId
	});

	const credit = createMovement({
		walletId: data.toWalletId,
		type: 'credit',
		amountCents: data.amountCents,
		description: `Transferencia: ${data.description}`,
		movementDate: data.movementDate,
		transferGroupId: groupId
	});

	return { debit, credit, groupId };
}

export function deleteMovement(movementId: number) {
	const movement = db
		.select()
		.from(walletMovements)
		.where(eq(walletMovements.id, movementId))
		.get();

	if (!movement) return;

	db.delete(walletMovements).where(eq(walletMovements.id, movementId)).run();
	recalculateRunningBalances(movement.walletId);
}

export function getWalletBalance(walletId: number): number {
	const lastMovement = db
		.select()
		.from(walletMovements)
		.where(eq(walletMovements.walletId, walletId))
		.orderBy(asc(walletMovements.movementDate), asc(walletMovements.id))
		.all();

	if (lastMovement.length === 0) {
		const wallet = db.select().from(wallets).where(eq(wallets.id, walletId)).get();
		return wallet?.initialBalanceCents ?? 0;
	}

	return lastMovement[lastMovement.length - 1].runningBalanceCents;
}
