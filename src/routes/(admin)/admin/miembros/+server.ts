import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { members } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { hashPin } from '$lib/server/auth.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.isAdmin) return json({ error: 'No autorizado' }, { status: 401 });

	const { id, name, email } = await request.json();

	if (id) {
		const existing = db
			.select()
			.from(members)
			.where(eq(members.email, email))
			.get();

		if (existing && existing.id !== id) {
			return json({ error: 'Ya existe un miembro con ese correo' });
		}

		db.update(members)
			.set({ name, email, updatedAt: new Date().toISOString() })
			.where(eq(members.id, id))
			.run();
	} else {
		const existing = db.select().from(members).where(eq(members.email, email)).get();
		if (existing) {
			return json({ error: 'Ya existe un miembro con ese correo' });
		}

		db.insert(members)
			.values({ name, email, pinHash: hashPin('000000'), mustChangePin: true })
			.run();
	}

	return json({ ok: true });
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.isAdmin) return json({ error: 'No autorizado' }, { status: 401 });

	const { id, action } = await request.json();

	if (action === 'resetPin') {
		db.update(members)
			.set({
				pinHash: hashPin('000000'),
				mustChangePin: true,
				updatedAt: new Date().toISOString()
			})
			.where(eq(members.id, id))
			.run();
	}

	return json({ ok: true });
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.isAdmin) return json({ error: 'No autorizado' }, { status: 401 });

	const { id } = await request.json();
	db.delete(members).where(eq(members.id, id)).run();
	return json({ ok: true });
};
