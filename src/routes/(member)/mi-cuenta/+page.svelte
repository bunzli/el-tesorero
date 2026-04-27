<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format.js';

	let { data } = $props();
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-xl font-bold text-gray-800">Hola, {data.member.name}</h2>
		<p class="text-sm text-gray-500">Resumen de tu cuenta</p>
	</div>

	<!-- Deuda total -->
	{#if data.totalDebt > 0}
		<Card class="bg-gradient-to-r from-primary-600 to-primary-700 border-0 text-white">
			<p class="text-sm opacity-80">Deuda al día de hoy</p>
			<p class="text-3xl font-bold mt-1">{formatCurrency(data.totalDebt)}</p>
		</Card>
	{:else if data.debts.length > 0}
		<Card class="bg-gradient-to-r from-success-500 to-success-600 border-0 text-white">
			<p class="text-sm opacity-80">Estado al día de hoy</p>
			<p class="text-xl font-bold mt-1">Al día — sin deudas pendientes</p>
		</Card>
	{/if}

	<!-- Deuda por evento -->
	{#each data.debts as debt}
		<Card>
			<div class="flex items-start justify-between">
				<div>
					<h3 class="font-semibold text-gray-800">{debt.eventName}</h3>
					<p class="text-sm text-gray-500 mt-0.5">
						{formatCurrency(debt.installmentAmount)} × {debt.numInstallments} cuotas
					</p>
					{#if debt.dueInstallments < debt.numInstallments}
						<p class="text-xs text-gray-400 mt-0.5">
							Cuotas vencidas: {debt.dueInstallments} de {debt.numInstallments}
						</p>
					{/if}
				</div>
				<Badge variant={debt.remaining > 0 ? 'warning' : 'success'}>
					{debt.remaining > 0 ? `Debes ${formatCurrency(debt.remaining)}` : 'Al día'}
				</Badge>
			</div>
			<div class="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
				<div
					class="h-full rounded-full bg-primary-500 transition-all"
					style="width: {Math.min(100, debt.totalAmount > 0 ? (debt.paid / debt.totalAmount) * 100 : 0)}%"
				></div>
			</div>
			<p class="mt-1 text-xs text-gray-400">
				Pagado {formatCurrency(debt.paid)} de {formatCurrency(debt.totalAmount)} total
				{#if debt.amountDueNow < debt.totalAmount}
					<span class="text-primary-500">(vence hoy: {formatCurrency(debt.amountDueNow)})</span>
				{/if}
			</p>
		</Card>
	{/each}

	<!-- Historial de pagos -->
	<div>
		<h3 class="text-lg font-semibold text-gray-800 mb-3">Historial de pagos</h3>
		{#if data.receipts.length === 0}
			<Card>
				<p class="text-sm text-gray-500 text-center py-4">Aún no tienes pagos registrados</p>
			</Card>
		{:else}
			<div class="space-y-2">
				{#each data.receipts as receipt}
					<Card>
						<div class="flex items-center justify-between">
							<div>
								<p class="font-medium text-gray-800">{receipt.eventName}</p>
								<p class="text-xs text-gray-500">{formatDate(receipt.transferDate)}</p>
								{#if receipt.message}
									<p class="text-xs text-gray-400 mt-0.5">{receipt.message}</p>
								{/if}
							</div>
							<div class="text-right">
								<p class="font-semibold">{formatCurrency(receipt.amountCents)}</p>
								<Badge variant={receipt.status === 'approved' ? 'success' : receipt.status === 'rejected' ? 'danger' : 'warning'}>
									{receipt.status === 'approved' ? 'Aprobado' : receipt.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
								</Badge>
							</div>
						</div>
					</Card>
				{/each}
			</div>
		{/if}
	</div>

	<div class="pb-4">
		<a href="/comprobantes/nuevo">
			<Button fullWidth size="lg">Subir comprobante de pago</Button>
		</a>
	</div>
</div>
