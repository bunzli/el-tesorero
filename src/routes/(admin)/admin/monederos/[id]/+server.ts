import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { createMovement, createTransfer, deleteMovement } from '$lib/server/wallets.js';

export const POST: RequestHandler = async ({ request, locals, params }) => {
	if (!locals.isAdmin) return json({ error: 'No autorizado' }, { status: 401 });

	const walletId = Number(params.id);
	const body = await request.json();

	if (body.action === 'movement') {
		createMovement({
			walletId,
			type: body.type,
			amountCents: body.amountCents,
			description: body.description,
			movementDate: body.movementDate,
			eventId: body.eventId,
			memberId: body.memberId
		});
		return json({ ok: true });
	}

	if (body.action === 'transfer') {
		createTransfer({
			fromWalletId: walletId,
			toWalletId: body.toWalletId,
			amountCents: body.amountCents,
			description: body.description,
			movementDate: body.movementDate
		});
		return json({ ok: true });
	}

	return json({ error: 'Acción inválida' }, { status: 400 });
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.isAdmin) return json({ error: 'No autorizado' }, { status: 401 });

	const { movementId } = await request.json();
	deleteMovement(movementId);
	return json({ ok: true });
};
