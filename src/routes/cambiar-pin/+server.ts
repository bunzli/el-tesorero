import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { members } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { hashPin } from '$lib/server/auth.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.member) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	const { pin } = await request.json();

	if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
		return json({ error: 'PIN debe ser 6 dígitos' });
	}

	if (pin === '000000') {
		return json({ error: 'Elige un PIN diferente al inicial' });
	}

	db.update(members)
		.set({ pinHash: hashPin(pin), mustChangePin: false, updatedAt: new Date().toISOString() })
		.where(eq(members.id, locals.member.id))
		.run();

	return json({ ok: true });
};
