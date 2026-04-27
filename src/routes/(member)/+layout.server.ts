import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { members } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.member) {
		redirect(302, '/login');
	}

	const member = db.select().from(members).where(eq(members.id, locals.member.id)).get();

	if (member?.mustChangePin) {
		redirect(302, '/cambiar-pin');
	}

	return {
		member: {
			id: locals.member.id,
			name: locals.member.name,
			email: locals.member.email
		}
	};
};
