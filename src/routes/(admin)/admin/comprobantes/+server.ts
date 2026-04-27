import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { paymentReceipts } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { createMovement } from '$lib/server/wallets.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.isAdmin) return json({ error: 'No autorizado' }, { status: 401 });

	const body = await request.json();

	if (body.action === 'approve') {
		const receipt = db
			.select()
			.from(paymentReceipts)
			.where(eq(paymentReceipts.id, body.receiptId))
			.get();

		if (!receipt) return json({ error: 'Comprobante no encontrado' }, { status: 404 });

		const updates: Partial<{ amountCents: number; eventId: number; transferDate: string }> = {};

		if (body.amountCents && body.amountCents !== receipt.amountCents) {
			updates.amountCents = body.amountCents;
		}
		if (body.eventId && body.eventId !== receipt.eventId) {
			updates.eventId = body.eventId;
		}
		if (body.transferDate && body.transferDate !== receipt.transferDate) {
			updates.transferDate = body.transferDate;
		}

		if (Object.keys(updates).length > 0) {
			db.update(paymentReceipts)
				.set(updates)
				.where(eq(paymentReceipts.id, receipt.id))
				.run();
		}

		const finalReceipt = db.select().from(paymentReceipts).where(eq(paymentReceipts.id, receipt.id)).get()!;

		createMovement({
			walletId: body.walletId,
			type: 'credit',
			amountCents: finalReceipt.amountCents,
			description: `Comprobante #${receipt.id}`,
			movementDate: finalReceipt.transferDate,
			eventId: finalReceipt.eventId,
			memberId: finalReceipt.memberId,
			receiptId: receipt.id
		});

		db.update(paymentReceipts)
			.set({ status: 'approved', reviewedAt: new Date().toISOString() })
			.where(eq(paymentReceipts.id, receipt.id))
			.run();

		return json({ ok: true });
	}

	if (body.action === 'reject') {
		db.update(paymentReceipts)
			.set({ status: 'rejected', reviewedAt: new Date().toISOString() })
			.where(eq(paymentReceipts.id, body.receiptId))
			.run();

		return json({ ok: true });
	}

	return json({ error: 'Acción inválida' }, { status: 400 });
};
