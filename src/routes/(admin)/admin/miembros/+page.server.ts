import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { members } from '$lib/server/db/schema.js';

export const load: PageServerLoad = async () => {
	const allMembers = db.select().from(members).orderBy(members.name).all();
	return {
		members: allMembers.map((m) => ({
			id: m.id,
			name: m.name,
			email: m.email,
			mustChangePin: m.mustChangePin,
			createdAt: m.createdAt
		}))
	};
};
