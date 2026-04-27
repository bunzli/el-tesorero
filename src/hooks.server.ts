import type { Handle } from '@sveltejs/kit';
import { getMemberSession, isAdminSession } from '$lib/server/auth.js';
import { db } from '$lib/server/db/index.js';
import { members } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
	const memberToken = event.cookies.get('session');
	const adminToken = event.cookies.get('admin_session');

	if (memberToken) {
		const memberId = getMemberSession(memberToken);
		if (memberId) {
			const member = db
				.select({ id: members.id, name: members.name, email: members.email })
				.from(members)
				.where(eq(members.id, memberId))
				.get();
			if (member) {
				event.locals.member = member;
			}
		}
	}

	if (adminToken && isAdminSession(adminToken)) {
		event.locals.isAdmin = true;
	}

	return resolve(event);
};
