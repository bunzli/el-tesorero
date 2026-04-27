import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { createAdminSession } from '$lib/server/auth.js';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { pin } = await request.json();
	const adminPin = process.env.ADMIN_PIN || '000000';

	if (pin !== adminPin) {
		return json({ error: 'PIN incorrecto' });
	}

	const token = createAdminSession();
	cookies.set('admin_session', token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 7 * 24 * 60 * 60
	});

	return json({ redirect: '/admin' });
};
