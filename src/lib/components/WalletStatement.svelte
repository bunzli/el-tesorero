<script lang="ts">
	import { formatCurrency, formatDate } from '$lib/utils/format.js';
	import Badge from './ui/Badge.svelte';

	interface Movement {
		id: number;
		type: 'credit' | 'debit';
		amountCents: number;
		description: string;
		movementDate: string;
		runningBalanceCents: number;
		eventName?: string | null;
		memberName?: string | null;
		transferGroupId?: string | null;
	}

	interface Props {
		walletName: string;
		initialBalanceCents: number;
		movements: Movement[];
		onDelete?: (id: number) => void;
	}

	let { walletName, initialBalanceCents, movements, onDelete }: Props = $props();

	const currentBalance = $derived(movements.length > 0
		? movements[movements.length - 1].runningBalanceCents
		: initialBalanceCents);
</script>

<div class="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
	<!-- Header -->
	<div class="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-5 text-white">
		<p class="text-sm opacity-70">{walletName}</p>
		<p class="text-3xl font-bold mt-1">{formatCurrency(currentBalance)}</p>
		<p class="text-xs opacity-50 mt-1">Saldo actual</p>
	</div>

	<!-- Statement -->
	<div class="divide-y divide-gray-50">
		<!-- Initial balance row -->
		<div class="flex items-center justify-between px-6 py-3 bg-gray-50">
			<div class="flex items-center gap-3">
				<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
					→
				</div>
				<div>
					<p class="text-sm font-medium text-gray-500">Saldo inicial</p>
				</div>
			</div>
			<div class="text-right">
				<p class="text-sm font-semibold text-gray-600">{formatCurrency(initialBalanceCents)}</p>
			</div>
		</div>

		{#each movements as mov}
			<div class="flex items-center justify-between px-6 py-3 hover:bg-gray-50 group transition-colors">
				<div class="flex items-center gap-3 min-w-0 flex-1">
					<div class="w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0
						{mov.type === 'credit' ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'}">
						{mov.type === 'credit' ? '+' : '−'}
					</div>
					<div class="min-w-0">
						<p class="text-sm font-medium text-gray-800 truncate">{mov.description}</p>
						<div class="flex items-center gap-2 mt-0.5">
							<span class="text-xs text-gray-400">{formatDate(mov.movementDate)}</span>
							{#if mov.eventName}
								<Badge>{mov.eventName}</Badge>
							{/if}
							{#if mov.memberName}
								<span class="text-xs text-gray-400">· {mov.memberName}</span>
							{/if}
							{#if mov.transferGroupId}
								<Badge>Transferencia</Badge>
							{/if}
						</div>
					</div>
				</div>
				<div class="text-right flex-shrink-0 ml-4">
					<p class="text-sm font-semibold {mov.type === 'credit' ? 'text-success-600' : 'text-danger-600'}">
						{mov.type === 'credit' ? '+' : '−'}{formatCurrency(mov.amountCents)}
					</p>
					<p class="text-xs text-gray-400">{formatCurrency(mov.runningBalanceCents)}</p>
				</div>
				{#if onDelete}
					<button
						type="button"
						class="ml-2 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-danger-500 transition-all"
						onclick={() => onDelete(mov.id)}
						title="Eliminar"
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
					</button>
				{/if}
			</div>
		{/each}

		{#if movements.length === 0}
			<div class="px-6 py-8 text-center text-sm text-gray-400">
				Sin movimientos registrados
			</div>
		{/if}
	</div>
</div>
