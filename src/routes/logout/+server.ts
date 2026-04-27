import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { deleteMemberSession, deleteAdminSession } from '$lib/server/auth.js';

export const POST: RequestHandler = async ({ cookies }) => {
	const memberToken = cookies.get('session');
	const adminToken = cookies.get('admin_session');

	if (memberToken) {
		deleteMemberSession(memberToken);
		cookies.delete('session', { path: '/' });
	}
	if (adminToken) {
		deleteAdminSession(adminToken);
		cookies.delete('admin_session', { path: '/' });
	}

	return json({ ok: true });
};
