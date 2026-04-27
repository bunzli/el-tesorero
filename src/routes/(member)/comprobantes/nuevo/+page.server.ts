import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { events } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const activeEvents = db.select().from(events).where(eq(events.active, true)).all();
	const defaultEventId = activeEvents.find((e) => e.isDefault)?.id ?? null;
	return { events: activeEvents, defaultEventId };
};
