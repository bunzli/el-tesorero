<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { formatCurrency, formatDate, formatDateTime } from '$lib/utils/format.js';

	let { data } = $props();

	let filter = $state<'pending' | 'approved' | 'rejected' | 'all'>('pending');

	const filtered = $derived(
		filter === 'all' ? data.receipts : data.receipts.filter((r) => r.status === filter)
	);

	let editingId = $state<number | null>(null);
	let editAmount = $state('');
	let editEventId = $state('');
	let editDate = $state('');
	let approveWalletId = $state('');
	let processing = $state(false);

	function startEdit(receipt: typeof data.receipts[0]) {
		editingId = receipt.id;
		editAmount = String(receipt.amountCents / 100);
		editEventId = String(receipt.eventId);
		editDate = receipt.transferDate;
		approveWalletId = data.defaultWalletId ? String(data.defaultWalletId) : '';
	}

	async function approve(receiptId: number) {
		if (!approveWalletId) return;
		processing = true;

		await fetch('/admin/comprobantes', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				action: 'approve',
				receiptId,
				walletId: Number(approveWalletId),
				amountCents: Math.round(Number(editAmount) * 100),
				eventId: Number(editEventId),
				transferDate: editDate
			})
		});

		processing = false;
		editingId = null;
		window.location.reload();
	}

	async function reject(receiptId: number) {
		processing = true;

		await fetch('/admin/comprobantes', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ action: 'reject', receiptId })
		});

		processing = false;
		editingId = null;
		window.location.reload();
	}
</script>

<div class="space-y-6">
	<h2 class="text-2xl font-bold text-gray-800">Comprobantes de pago</h2>

	<!-- Filter tabs -->
	<div class="flex gap-2">
		{#each [
			{ key: 'pending', label: 'Pendientes' },
			{ key: 'approved', label: 'Aprobados' },
			{ key: 'rejected', label: 'Rechazados' },
			{ key: 'all', label: 'Todos' }
		] as tab}
			<button
				class="px-4 py-2 rounded-xl text-sm font-medium transition-colors
					{filter === tab.key ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:bg-gray-50'}"
				onclick={() => { filter = tab.key as typeof filter; editingId = null; }}
			>
				{tab.label}
				{#if tab.key === 'pending'}
					{@const count = data.receipts.filter(r => r.status === 'pending').length}
					{#if count > 0}
						<span class="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-warning-500 text-white text-xs">{count}</span>
					{/if}
				{/if}
			</button>
		{/each}
	</div>

	{#if filtered.length === 0}
		<Card>
			<p class="text-center text-sm text-gray-500 py-4">No hay comprobantes {filter === 'all' ? '' : filter === 'pending' ? 'pendientes' : filter === 'approved' ? 'aprobados' : 'rechazados'}</p>
		</Card>
	{/if}

	{#each filtered as receipt}
		<Card>
			<div class="space-y-3">
				<div class="flex items-start justify-between">
					<div>
						<p class="font-semibold text-gray-800">{receipt.memberName}</p>
						<p class="text-xs text-gray-400">{receipt.memberEmail}</p>
					</div>
					<Badge variant={receipt.status === 'approved' ? 'success' : receipt.status === 'rejected' ? 'danger' : 'warning'}>
						{receipt.status === 'approved' ? 'Aprobado' : receipt.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
					</Badge>
				</div>

				<div class="grid grid-cols-3 gap-4 text-sm">
					<div>
						<p class="text-gray-500">Monto</p>
						<p class="font-semibold">{formatCurrency(receipt.amountCents)}</p>
					</div>
					<div>
						<p class="text-gray-500">Fecha transferencia</p>
						<p class="font-medium">{formatDate(receipt.transferDate)}</p>
					</div>
					<div>
						<p class="text-gray-500">Evento</p>
						<p class="font-medium">{receipt.eventName}</p>
					</div>
				</div>

				{#if receipt.message}
					<p class="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">"{receipt.message}"</p>
				{/if}

				<!-- File preview -->
				<div class="rounded-lg overflow-hidden border border-gray-100">
					{#if receipt.filePath.match(/\.(jpg|jpeg|png|gif|webp)$/i)}
						<img
							src="/api/uploads/{receipt.filePath}"
							alt="Comprobante"
							class="w-full max-h-64 object-contain bg-gray-50"
						/>
					{:else}
						<a href="/api/uploads/{receipt.filePath}" target="_blank" class="flex items-center gap-2 px-4 py-3 text-sm text-primary-600 hover:bg-gray-50">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
							Ver archivo
						</a>
					{/if}
				</div>

				{#if receipt.status === 'pending'}
					{#if editingId === receipt.id}
						<div class="space-y-3 pt-2 border-t border-gray-100">
							<div class="grid grid-cols-3 gap-3">
								<Input label="Monto ($)" type="number" bind:value={editAmount} min="1" step="1" />
								<Input label="Fecha transferencia" type="date" bind:value={editDate} />
								<label class="block">
									<span class="mb-1.5 block text-sm font-medium text-gray-700">Evento</span>
									<select bind:value={editEventId} class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm">
										{#each data.events as ev}
											<option value={ev.id}>{ev.name}</option>
										{/each}
									</select>
								</label>
							</div>
							<label class="block">
								<span class="mb-1.5 block text-sm font-medium text-gray-700">Monedero destino</span>
								<select bind:value={approveWalletId} class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm" required>
									{#each data.wallets as w}
										<option value={w.id}>{w.name}</option>
									{/each}
								</select>
							</label>
							<div class="flex gap-2">
								<Button onclick={() => approve(receipt.id)} disabled={processing}>
									{processing ? 'Procesando...' : 'Aprobar'}
								</Button>
								<Button variant="danger" onclick={() => reject(receipt.id)} disabled={processing}>
									Rechazar
								</Button>
								<Button variant="ghost" onclick={() => editingId = null}>Cancelar</Button>
							</div>
						</div>
					{:else}
						<div class="flex gap-2 pt-2">
							<Button size="sm" onclick={() => startEdit(receipt)}>Revisar y aprobar</Button>
							<Button variant="danger" size="sm" onclick={() => reject(receipt.id)}>Rechazar</Button>
						</div>
					{/if}
				{/if}

				<p class="text-xs text-gray-400">Enviado {formatDateTime(receipt.createdAt)}</p>
			</div>
		</Card>
	{/each}
</div>
