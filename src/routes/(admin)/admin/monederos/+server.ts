import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { wallets } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.isAdmin) return json({ error: 'No autorizado' }, { status: 401 });

	const { name, initialBalanceCents } = await request.json();

	db.insert(wallets)
		.values({ name, initialBalanceCents: initialBalanceCents ?? 0 })
		.run();

	return json({ ok: true });
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.isAdmin) return json({ error: 'No autorizado' }, { status: 401 });

	const body = await request.json();

	if (body.action === 'setDefault') {
		db.update(wallets).set({ isDefault: false }).run();
		db.update(wallets).set({ isDefault: true }).where(eq(wallets.id, body.id)).run();
	}

	return json({ ok: true });
};
