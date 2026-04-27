<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { formatCurrency } from '$lib/utils/format.js';

	let { data } = $props();

	import Badge from '$lib/components/ui/Badge.svelte';

	let showForm = $state(false);
	let name = $state('');
	let initialBalance = $state('0');
	let saving = $state(false);

	async function setDefault(walletId: number) {
		await fetch('/admin/monederos', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: walletId, action: 'setDefault' })
		});
		window.location.reload();
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		saving = true;
		await fetch('/admin/monederos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name,
				initialBalanceCents: Math.round(Number(initialBalance) * 100)
			})
		});
		saving = false;
		showForm = false;
		name = '';
		initialBalance = '0';
		window.location.reload();
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold text-gray-800">Monederos</h2>
		<Button onclick={() => showForm = !showForm}>
			{showForm ? 'Cancelar' : '+ Nuevo monedero'}
		</Button>
	</div>

	{#if showForm}
		<Card>
			<form onsubmit={submit} class="space-y-4">
				<h3 class="font-semibold text-gray-800">Nuevo monedero</h3>
				<Input label="Nombre" bind:value={name} required placeholder="Ej: Cuenta principal" />
				<Input label="Saldo inicial ($)" type="number" bind:value={initialBalance} step="1" />
				<Button type="submit" disabled={saving}>{saving ? 'Creando...' : 'Crear monedero'}</Button>
			</form>
		</Card>
	{/if}

	<div class="grid gap-4 sm:grid-cols-2">
		{#each data.wallets as wallet}
			<Card class="hover:border-primary-200 transition-colors">
				<a href="/admin/monederos/{wallet.id}" class="block">
					<div class="flex items-center gap-2">
						<p class="font-semibold text-gray-800">{wallet.name}</p>
						{#if wallet.isDefault}
							<Badge variant="success">Default</Badge>
						{/if}
					</div>
					<p class="text-2xl font-bold mt-2 {wallet.balance >= 0 ? 'text-gray-800' : 'text-danger-600'}">
						{formatCurrency(wallet.balance)}
					</p>
					<p class="text-xs text-gray-400 mt-1">{wallet.movementCount} movimiento{wallet.movementCount !== 1 ? 's' : ''}</p>
				</a>
				{#if !wallet.isDefault}
					<div class="mt-2 pt-2 border-t border-gray-50">
						<Button variant="ghost" size="sm" onclick={(e) => { e.preventDefault(); e.stopPropagation(); setDefault(wallet.id); }}>
							Marcar como default
						</Button>
					</div>
				{/if}
			</Card>
		{/each}
	</div>

	{#if data.wallets.length === 0}
		<Card>
			<p class="text-center text-sm text-gray-500 py-4">No hay monederos creados</p>
		</Card>
	{/if}
</div>
