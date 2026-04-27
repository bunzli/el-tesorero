import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { paymentReceipts } from '$lib/server/db/schema.js';
import { saveUpload } from '$lib/server/files.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.member) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	const formData = await request.formData();
	const file = formData.get('file') as File;
	const eventId = Number(formData.get('eventId'));
	const amountCents = Number(formData.get('amountCents'));
	const transferDate = formData.get('transferDate') as string;
	const message = (formData.get('message') as string) || null;

	if (!file || !eventId || !amountCents || !transferDate) {
		return json({ error: 'Datos incompletos' });
	}

	const filePath = await saveUpload(file);

	db.insert(paymentReceipts)
		.values({
			memberId: locals.member.id,
			eventId,
			amountCents,
			transferDate,
			message,
			filePath
		})
		.run();

	return json({ ok: true });
};
