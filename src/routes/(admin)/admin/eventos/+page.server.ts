import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { events } from '$lib/server/db/schema.js';

export const load: PageServerLoad = async () => {
	const allEvents = db.select().from(events).orderBy(events.startDate).all().reverse();
	return { events: allEvents };
};
