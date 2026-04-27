import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { wallets, walletMovements, events, members } from '$lib/server/db/schema.js';
import { eq, asc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const wallet = db.select().from(wallets).where(eq(wallets.id, Number(params.id))).get();
	if (!wallet) error(404, 'Monedero no encontrado');

	const movements = db
		.select({
			id: walletMovements.id,
			type: walletMovements.type,
			amountCents: walletMovements.amountCents,
			description: walletMovements.description,
			movementDate: walletMovements.movementDate,
			runningBalanceCents: walletMovements.runningBalanceCents,
			transferGroupId: walletMovements.transferGroupId,
			eventId: walletMovements.eventId,
			memberId: walletMovements.memberId
		})
		.from(walletMovements)
		.where(eq(walletMovements.walletId, wallet.id))
		.orderBy(asc(walletMovements.movementDate), asc(walletMovements.id))
		.all();

	const allEvents = db.select({ id: events.id, name: events.name }).from(events).all();
	const allMembers = db.select({ id: members.id, name: members.name }).from(members).all();
	const allWallets = db.select({ id: wallets.id, name: wallets.name }).from(wallets).all();

	const eventsMap = Object.fromEntries(allEvents.map((e) => [e.id, e.name]));
	const membersMap = Object.fromEntries(allMembers.map((m) => [m.id, m.name]));

	const enrichedMovements = movements.map((m) => ({
		...m,
		eventName: m.eventId ? eventsMap[m.eventId] ?? null : null,
		memberName: m.memberId ? membersMap[m.memberId] ?? null : null
	}));

	return {
		wallet,
		movements: enrichedMovements,
		events: allEvents,
		members: allMembers,
		wallets: allWallets.filter((w) => w.id !== wallet.id)
	};
};
