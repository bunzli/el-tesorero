import type { RequestHandler } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { members, events, wallets, walletMovements, paymentReceipts } from '$lib/server/db/schema.js';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.isAdmin) {
		return new Response(JSON.stringify({ error: 'No autorizado' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const exportedAt = new Date().toISOString();

	const data = {
		exported_at: exportedAt,
		version: 1,
		data: {
			members: db.select().from(members).all(),
			events: db.select().from(events).all(),
			wallets: db.select().from(wallets).all(),
			wallet_movements: db.select().from(walletMovements).all(),
			payment_receipts: db.select().from(paymentReceipts).all()
		}
	};

	const date = exportedAt.slice(0, 10);
	const filename = `tesorero-backup-${date}.json`;

	return new Response(JSON.stringify(data, null, 2), {
		headers: {
			'Content-Type': 'application/json',
			'Content-Disposition': `attachment; filename="${filename}"`
		}
	});
};
