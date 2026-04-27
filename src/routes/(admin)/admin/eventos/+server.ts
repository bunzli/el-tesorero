import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { events } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.isAdmin) return json({ error: 'No autorizado' }, { status: 401 });

	const body = await request.json();

	if (body.id) {
		db.update(events)
			.set({
				name: body.name,
				installmentAmountCents: body.installmentAmountCents,
				numInstallments: body.numInstallments,
				startDate: body.startDate,
				endDate: body.endDate
			})
			.where(eq(events.id, body.id))
			.run();
	} else {
		db.insert(events)
			.values({
				name: body.name,
				installmentAmountCents: body.installmentAmountCents,
				numInstallments: body.numInstallments,
				startDate: body.startDate,
				endDate: body.endDate
			})
			.run();
	}

	return json({ ok: true });
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.isAdmin) return json({ error: 'No autorizado' }, { status: 401 });

	const body = await request.json();

	if (body.action === 'setDefault') {
		db.update(events).set({ isDefault: false }).run();
		db.update(events).set({ isDefault: true }).where(eq(events.id, body.id)).run();
	} else {
		db.update(events).set({ active: body.active }).where(eq(events.id, body.id)).run();
	}

	return json({ ok: true });
};
