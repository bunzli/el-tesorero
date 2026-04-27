import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { wallets, walletMovements } from '$lib/server/db/schema.js';
import { eq, count } from 'drizzle-orm';
import { getWalletBalance } from '$lib/server/wallets.js';

export const load: PageServerLoad = async () => {
	const allWallets = db.select().from(wallets).all();

	const walletsWithData = allWallets.map((w) => {
		const mc = db
			.select({ count: count() })
			.from(walletMovements)
			.where(eq(walletMovements.walletId, w.id))
			.get();

		return {
			id: w.id,
			name: w.name,
			isDefault: w.isDefault,
			balance: getWalletBalance(w.id),
			movementCount: mc?.count ?? 0
		};
	});

	return { wallets: walletsWithData };
};
