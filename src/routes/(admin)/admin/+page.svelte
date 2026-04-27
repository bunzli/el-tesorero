<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { formatCurrency } from '$lib/utils/format.js';

	let { data } = $props();
</script>

<div class="space-y-6">
	<h2 class="text-2xl font-bold text-gray-800">Dashboard</h2>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<Card>
			<p class="text-sm text-gray-500">Miembros</p>
			<p class="text-2xl font-bold text-gray-800 mt-1">{data.stats.members}</p>
		</Card>
		<Card>
			<p class="text-sm text-gray-500">Eventos activos</p>
			<p class="text-2xl font-bold text-gray-800 mt-1">{data.stats.activeEvents}</p>
		</Card>
		<Card>
			<p class="text-sm text-gray-500">Comprobantes pendientes</p>
			<p class="text-2xl font-bold text-warning-600 mt-1">{data.stats.pendingReceipts}</p>
		</Card>
		<Card>
			<p class="text-sm text-gray-500">Saldo total monederos</p>
			<p class="text-2xl font-bold text-success-600 mt-1">{formatCurrency(data.stats.totalBalance)}</p>
		</Card>
	</div>

	{#if data.stats.pendingReceipts > 0}
		<Card>
			<div class="flex items-center justify-between">
				<div>
					<h3 class="font-semibold text-gray-800">Comprobantes por revisar</h3>
					<p class="text-sm text-gray-500">Tienes {data.stats.pendingReceipts} comprobante{data.stats.pendingReceipts > 1 ? 's' : ''} pendiente{data.stats.pendingReceipts > 1 ? 's' : ''}</p>
				</div>
				<a href="/admin/comprobantes" class="text-sm text-primary-600 hover:underline font-medium">
					Revisar →
				</a>
			</div>
		</Card>
	{/if}

	<!-- Wallets summary -->
	<h3 class="text-lg font-semibold text-gray-800">Monederos</h3>
	<div class="grid gap-4 sm:grid-cols-2">
		{#each data.wallets as wallet}
			<a href="/admin/monederos/{wallet.id}" class="block">
				<Card class="hover:border-primary-200 transition-colors">
					<p class="text-sm text-gray-500">{wallet.name}</p>
					<p class="text-xl font-bold mt-1 {wallet.balance >= 0 ? 'text-gray-800' : 'text-danger-600'}">{formatCurrency(wallet.balance)}</p>
				</Card>
			</a>
		{/each}
	</div>
</div>
