import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { paymentReceipts, members, events, wallets } from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const receipts = db
		.select({
			id: paymentReceipts.id,
			amountCents: paymentReceipts.amountCents,
			transferDate: paymentReceipts.transferDate,
			message: paymentReceipts.message,
			filePath: paymentReceipts.filePath,
			status: paymentReceipts.status,
			createdAt: paymentReceipts.createdAt,
			memberName: members.name,
			memberEmail: members.email,
			memberId: members.id,
			eventId: events.id,
			eventName: events.name
		})
		.from(paymentReceipts)
		.innerJoin(members, eq(paymentReceipts.memberId, members.id))
		.innerJoin(events, eq(paymentReceipts.eventId, events.id))
		.orderBy(desc(paymentReceipts.createdAt))
		.all();

	const allWallets = db
		.select({ id: wallets.id, name: wallets.name, isDefault: wallets.isDefault })
		.from(wallets)
		.all();
	const activeEvents = db
		.select({ id: events.id, name: events.name, isDefault: events.isDefault })
		.from(events)
		.where(eq(events.active, true))
		.all();

	const defaultWalletId = allWallets.find((w) => w.isDefault)?.id ?? allWallets[0]?.id ?? null;
	const defaultEventId = activeEvents.find((e) => e.isDefault)?.id ?? activeEvents[0]?.id ?? null;

	return { receipts, wallets: allWallets, events: activeEvents, defaultWalletId, defaultEventId };
};
