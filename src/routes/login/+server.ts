import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { members } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { verifyPin, createMemberSession } from '$lib/server/auth.js';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json();

	if (body.step === 'email') {
		const member = db
			.select()
			.from(members)
			.where(eq(members.email, body.email?.toLowerCase()))
			.get();

		if (!member) {
			return json({ error: 'Correo no encontrado' });
		}
		return json({ ok: true });
	}

	if (body.step === 'pin') {
		const member = db
			.select()
			.from(members)
			.where(eq(members.email, body.email?.toLowerCase()))
			.get();

		if (!member) {
			return json({ error: 'Correo no encontrado' });
		}

		if (!verifyPin(body.pin, member.pinHash)) {
			return json({ error: 'PIN incorrecto' });
		}

		const token = createMemberSession(member.id);
		cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 30 * 24 * 60 * 60
		});

		const redirect = member.mustChangePin ? '/cambiar-pin' : '/mi-cuenta';
		return json({ redirect });
	}

	return json({ error: 'Solicitud inválida' }, { status: 400 });
};
