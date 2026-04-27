import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { events, paymentReceipts, walletMovements } from '$lib/server/db/schema.js';
import { eq, and, sum } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent }) => {
	const { member } = await parent();

	const activeEvents = db.select().from(events).where(eq(events.active, true)).all();

	const debts = activeEvents.map((event) => {
		const total = event.installmentAmountCents * event.numInstallments;

		const approved = db
			.select({ total: sum(paymentReceipts.amountCents) })
			.from(paymentReceipts)
			.where(
				and(
					eq(paymentReceipts.memberId, member.id),
					eq(paymentReceipts.eventId, event.id),
					eq(paymentReceipts.status, 'approved')
				)
			)
			.get();

		const paid = Number(approved?.total ?? 0);

		return {
			eventId: event.id,
			eventName: event.name,
			installmentAmount: event.installmentAmountCents,
			numInstallments: event.numInstallments,
			total,
			paid,
			remaining: Math.max(0, total - paid)
		};
	});

	const totalDebt = debts.reduce((acc, d) => acc + d.remaining, 0);

	const receipts = db
		.select({
			id: paymentReceipts.id,
			amountCents: paymentReceipts.amountCents,
			transferDate: paymentReceipts.transferDate,
			message: paymentReceipts.message,
			status: paymentReceipts.status,
			eventName: events.name
		})
		.from(paymentReceipts)
		.innerJoin(events, eq(paymentReceipts.eventId, events.id))
		.where(eq(paymentReceipts.memberId, member.id))
		.orderBy(paymentReceipts.transferDate)
		.all()
		.reverse();

	return { debts, totalDebt, receipts };
};
