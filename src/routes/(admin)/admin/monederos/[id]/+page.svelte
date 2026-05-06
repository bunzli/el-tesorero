<script lang="ts">
	import WalletStatement from '$lib/components/WalletStatement.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { todayStr } from '$lib/utils/format.js';

	let { data } = $props();

	let showMovementForm = $state(false);
	let showTransferForm = $state(false);

	let movType = $state<'credit' | 'debit'>('credit');
	let movAmount = $state('');
	let movDesc = $state('');
	let movDate = $state(todayStr());
	let movEventId = $state('');
	let movMemberId = $state('');
	let movSaving = $state(false);

	let trfToWalletId = $state('');
	let trfAmount = $state('');
	let trfDesc = $state('');
	let trfDate = $state(todayStr());
	let trfSaving = $state(false);

	async function submitMovement(e: SubmitEvent) {
		e.preventDefault();
		movSaving = true;

		await fetch(`/admin/monederos/${data.wallet.id}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				action: 'movement',
				type: movType,
				amountCents: Math.round(Number(movAmount) * 100),
				description: movDesc,
				movementDate: movDate,
				eventId: movEventId ? Number(movEventId) : null,
				memberId: movMemberId ? Number(movMemberId) : null
			})
		});

		movSaving = false;
		showMovementForm = false;
		movAmount = '';
		movDesc = '';
		movDate = todayStr();
		movEventId = '';
		movMemberId = '';
		window.location.reload();
	}

	async function submitTransfer(e: SubmitEvent) {
		e.preventDefault();
		trfSaving = true;

		await fetch(`/admin/monederos/${data.wallet.id}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				action: 'transfer',
				toWalletId: Number(trfToWalletId),
				amountCents: Math.round(Number(trfAmount) * 100),
				description: trfDesc,
				movementDate: trfDate
			})
		});

		trfSaving = false;
		showTransferForm = false;
		trfToWalletId = '';
		trfAmount = '';
		trfDesc = '';
		trfDate = todayStr();
		window.location.reload();
	}

	async function handleDelete(movementId: number) {
		if (!confirm('¿Eliminar este movimiento?')) return;
		await fetch(`/admin/monederos/${data.wallet.id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ movementId })
		});
		window.location.reload();
	}
</script>

<div class="space-y-6">
	<div>
		<a href="/admin/monederos" class="text-sm text-primary-600 hover:underline">← Billeteras</a>
		<h2 class="text-2xl font-bold text-gray-800 mt-2">{data.wallet.name}</h2>
	</div>

	<!-- Action buttons -->
	<div class="flex flex-wrap gap-3">
		<Button onclick={() => { showMovementForm = !showMovementForm; showTransferForm = false; }}>
			{showMovementForm ? 'Cancelar' : '+ Movimiento'}
		</Button>
		{#if data.wallets.length > 0}
			<Button variant="secondary" onclick={() => { showTransferForm = !showTransferForm; showMovementForm = false; }}>
				{showTransferForm ? 'Cancelar' : '↔ Transferencia'}
			</Button>
		{/if}
	</div>

	{#if showMovementForm}
		<Card>
			<form onsubmit={submitMovement} class="space-y-4">
				<h3 class="font-semibold text-gray-800">Nuevo movimiento</h3>

				<div class="flex gap-2">
					<button
						type="button"
						class="flex-1 py-2 rounded-xl text-sm font-medium transition-colors
							{movType === 'credit' ? 'bg-success-50 text-success-600 ring-1 ring-success-200' : 'bg-gray-50 text-gray-500'}"
						onclick={() => movType = 'credit'}
					>
						Abono (+)
					</button>
					<button
						type="button"
						class="flex-1 py-2 rounded-xl text-sm font-medium transition-colors
							{movType === 'debit' ? 'bg-danger-50 text-danger-600 ring-1 ring-danger-500/20' : 'bg-gray-50 text-gray-500'}"
						onclick={() => movType = 'debit'}
					>
						Retiro (−)
					</button>
				</div>

				<Input label="Monto ($)" type="number" bind:value={movAmount} required min="1" step="1" />
				<Input label="Descripción" bind:value={movDesc} required placeholder="Ej: Pago cuota marzo" />
				<Input label="Fecha" type="date" bind:value={movDate} required />

				<div class="grid grid-cols-2 gap-4">
					<label class="block">
						<span class="mb-1.5 block text-sm font-medium text-gray-700">Evento (opcional)</span>
						<select bind:value={movEventId} class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm">
							<option value="">Sin evento</option>
							{#each data.events as ev}
								<option value={ev.id}>{ev.name}</option>
							{/each}
						</select>
					</label>
					<label class="block">
						<span class="mb-1.5 block text-sm font-medium text-gray-700">Miembro (opcional)</span>
						<select bind:value={movMemberId} class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm">
							<option value="">Sin miembro</option>
							{#each data.members as m}
								<option value={m.id}>{m.name}</option>
							{/each}
						</select>
					</label>
				</div>

				<Button type="submit" disabled={movSaving}>{movSaving ? 'Guardando...' : 'Crear movimiento'}</Button>
			</form>
		</Card>
	{/if}

	{#if showTransferForm}
		<Card>
			<form onsubmit={submitTransfer} class="space-y-4">
				<h3 class="font-semibold text-gray-800">Transferencia desde {data.wallet.name}</h3>
				<label class="block">
					<span class="mb-1.5 block text-sm font-medium text-gray-700">Monedero destino</span>
					<select bind:value={trfToWalletId} class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm" required>
						<option value="">Seleccionar...</option>
						{#each data.wallets as w}
							<option value={w.id}>{w.name}</option>
						{/each}
					</select>
				</label>
				<Input label="Monto ($)" type="number" bind:value={trfAmount} required min="1" step="1" />
				<Input label="Descripción" bind:value={trfDesc} required placeholder="Ej: Fondos para evento" />
				<Input label="Fecha" type="date" bind:value={trfDate} required />
				<Button type="submit" disabled={trfSaving}>{trfSaving ? 'Transfiriendo...' : 'Transferir'}</Button>
			</form>
		</Card>
	{/if}

	<!-- Statement -->
	<WalletStatement
		walletName={data.wallet.name}
		initialBalanceCents={data.wallet.initialBalanceCents}
		movements={data.movements}
		onDelete={handleDelete}
	/>
</div>
