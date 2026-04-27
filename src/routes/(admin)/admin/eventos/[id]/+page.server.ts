import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { events, members, paymentReceipts } from '$lib/server/db/schema.js';
import { eq, and, sum } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const event = db.select().from(events).where(eq(events.id, Number(params.id))).get();
	if (!event) error(404, 'Evento no encontrado');

	const allMembers = db.select().from(members).all();
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

		return {
			id: m.id,
			name: m.name,
			email: m.email,
			paid,
			total: totalPerMember,
			remaining: Math.max(0, totalPerMember - paid),
			percentage: totalPerMember > 0 ? Math.min(100, Math.round((paid / totalPerMember) * 100)) : 0
		};
	});

	const totalCollected = memberStatus.reduce((acc, m) => acc + m.paid, 0);
	const totalExpected = totalPerMember * allMembers.length;
	const totalRemaining = totalExpected - totalCollected;

	return {
		event,
		memberStatus,
		totalCollected,
		totalExpected,
		totalRemaining,
		totalPerMember
	};
};
