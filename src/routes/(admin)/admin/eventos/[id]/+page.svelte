<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { formatCurrency } from '$lib/utils/format.js';

	let { data } = $props();

	const collectedPercentage = $derived(data.totalExpected > 0
		? Math.round((data.totalCollected / data.totalExpected) * 100)
		: 0);
</script>

<div class="space-y-6">
	<div>
		<a href="/admin/eventos" class="text-sm text-primary-600 hover:underline">← Eventos</a>
		<h2 class="text-2xl font-bold text-gray-800 mt-2">{data.event.name}</h2>
		<p class="text-sm text-gray-500">
			{formatCurrency(data.event.installmentAmountCents)} × {data.event.numInstallments} cuota{data.event.numInstallments > 1 ? 's' : ''} por persona
			· Cuotas vencidas hoy: <strong>{data.dueInstallments}</strong> de {data.event.numInstallments}
		</p>
	</div>

	<!-- Summary cards -->
	<div class="grid gap-4 sm:grid-cols-4">
		<Card>
			<p class="text-sm text-gray-500">Recaudado</p>
			<p class="text-xl font-bold text-success-600 mt-1">{formatCurrency(data.totalCollected)}</p>
		</Card>
		<Card>
			<p class="text-sm text-gray-500">Deuda vigente</p>
			<p class="text-xl font-bold text-warning-600 mt-1">{formatCurrency(data.totalRemaining)}</p>
			<p class="text-xs text-gray-400 mt-0.5">sobre {formatCurrency(data.totalDueNow)} vencido</p>
		</Card>
		<Card>
			<p class="text-sm text-gray-500">Total del evento</p>
			<p class="text-xl font-bold text-gray-800 mt-1">{formatCurrency(data.totalExpected)}</p>
		</Card>
		<Card>
			<p class="text-sm text-gray-500">Al día</p>
			<p class="text-xl font-bold text-primary-600 mt-1">
				{data.memberStatus.filter(m => m.remaining === 0).length} / {data.memberStatus.length}
			</p>
			<p class="text-xs text-gray-400 mt-0.5">personas</p>
		</Card>
	</div>

	<!-- Progress against full total -->
	<Card>
		<div class="flex items-center justify-between mb-2">
			<p class="text-sm font-medium text-gray-700">Progreso total del evento</p>
			<p class="text-sm font-semibold text-primary-600">{collectedPercentage}%</p>
		</div>
		<div class="h-3 rounded-full bg-gray-100 overflow-hidden">
			<div class="h-full rounded-full bg-primary-500 transition-all" style="width: {collectedPercentage}%"></div>
		</div>
		<p class="text-xs text-gray-400 mt-1">{formatCurrency(data.totalCollected)} de {formatCurrency(data.totalExpected)}</p>
	</Card>

	<!-- Member table -->
	<Card padding={false}>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-gray-100 text-left">
						<th class="px-4 py-3 font-medium text-gray-500">Nombre</th>
						<th class="px-4 py-3 font-medium text-gray-500 text-right">Pagado</th>
						<th class="px-4 py-3 font-medium text-gray-500 text-right">Deuda hoy</th>
						<th class="px-4 py-3 font-medium text-gray-500 text-right">Progreso total</th>
					</tr>
				</thead>
				<tbody>
					{#each data.memberStatus as m}
						<tr class="border-b border-gray-50 hover:bg-gray-50">
							<td class="px-4 py-3">
								<p class="font-medium text-gray-800">{m.name}</p>
								<p class="text-xs text-gray-400">{m.email}</p>
							</td>
							<td class="px-4 py-3 text-right font-medium text-success-600">{formatCurrency(m.paid)}</td>
							<td class="px-4 py-3 text-right">
								{#if m.remaining > 0}
									<span class="text-danger-600 font-medium">{formatCurrency(m.remaining)}</span>
									<p class="text-xs text-gray-400">de {formatCurrency(m.amountDueNow)} vencido</p>
								{:else}
									<Badge variant="success">Al día</Badge>
								{/if}
							</td>
							<td class="px-4 py-3 text-right">
								<div class="flex items-center justify-end gap-2">
									<div class="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
										<div class="h-full rounded-full bg-primary-500" style="width: {m.percentage}%"></div>
									</div>
									<span class="text-xs text-gray-500 w-8 text-right">{m.percentage}%</span>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Card>
</div>
