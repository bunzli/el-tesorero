import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { members, events, paymentReceipts, wallets } from '$lib/server/db/schema.js';
import { eq, count } from 'drizzle-orm';
import { getWalletBalance } from '$lib/server/wallets.js';

export const load: PageServerLoad = async () => {
	const membersCount = db.select({ count: count() }).from(members).get()?.count ?? 0;
	const activeEvents = db
		.select({ count: count() })
		.from(events)
		.where(eq(events.active, true))
		.get()?.count ?? 0;
	const pendingReceipts = db
		.select({ count: count() })
		.from(paymentReceipts)
		.where(eq(paymentReceipts.status, 'pending'))
		.get()?.count ?? 0;

	const allWallets = db.select().from(wallets).all();
	const walletsWithBalance = allWallets.map((w) => ({
		id: w.id,
		name: w.name,
		balance: getWalletBalance(w.id)
	}));

	const totalBalance = walletsWithBalance.reduce((acc, w) => acc + w.balance, 0);

	return {
		stats: {
			members: membersCount,
			activeEvents,
			pendingReceipts,
			totalBalance
		},
		wallets: walletsWithBalance
	};
};
