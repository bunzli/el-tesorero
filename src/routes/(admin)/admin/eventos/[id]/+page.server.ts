import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { events, members, paymentReceipts } from '$lib/server/db/schema.js';
import { eq, and, sum } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { installmentsDueByNow } from '$lib/utils/events.js';

export const load: PageServerLoad = async ({ params }) => {
	const event = db.select().from(events).where(eq(events.id, Number(params.id))).get();
	if (!event) error(404, 'Evento no encontrado');

	const allMembers = db.select().from(members).all();
	const dueInstallments = installmentsDueByNow(event);
	const amountDueNowPerMember = event.installmentAmountCents * dueInstallments;
	const totalPerMember = event.installmentAmountCents * event.numInstallments;

	const memberStatus = allMembers.map((m) => {
		const approved = db
			.select({ total: sum(paymentReceipts.amountCents) })
			.from(paymentReceipts)
			.where(
				and(
					eq(paymentReceipts.memberId, m.id),
					eq(paymentReceipts.eventId, event.id),
					eq(paymentReceipts.status, 'approved')
				)
			)
			.get();

		const paid = Number(approved?.total ?? 0);
		const remaining = Math.max(0, amountDueNowPerMember - paid);

		return {
			id: m.id,
			name: m.name,
			email: m.email,
			paid,
			amountDueNow: amountDueNowPerMember,
			totalAmount: totalPerMember,
			remaining,
			percentage: totalPerMember > 0 ? Math.min(100, Math.round((paid / totalPerMember) * 100)) : 0
		};
	});

	const totalCollected = memberStatus.reduce((acc, m) => acc + m.paid, 0);
	const totalDueNow = amountDueNowPerMember * allMembers.length;
	const totalRemaining = memberStatus.reduce((acc, m) => acc + m.remaining, 0);
	const totalExpected = totalPerMember * allMembers.length;

	return {
		event,
		memberStatus,
		dueInstallments,
		totalCollected,
		totalDueNow,
		totalRemaining,
		totalExpected,
		totalPerMember,
		amountDueNowPerMember
	};
};
