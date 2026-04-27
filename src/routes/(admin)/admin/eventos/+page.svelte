<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { formatCurrency, formatDate } from '$lib/utils/format.js';

	let { data } = $props();

	let showForm = $state(false);
	let form = $state({ name: '', amount: '', installments: '1', startDate: '', endDate: '' });
	let saving = $state(false);
	let editingId = $state<number | null>(null);

	function resetForm() {
		form = { name: '', amount: '', installments: '1', startDate: '', endDate: '' };
		editingId = null;
		showForm = false;
	}

	function startEdit(event: typeof data.events[0]) {
		editingId = event.id;
		form = {
			name: event.name,
			amount: String(event.installmentAmountCents / 100),
			installments: String(event.numInstallments),
			startDate: event.startDate,
			endDate: event.endDate || ''
		};
		showForm = true;
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		saving = true;

		const body = {
			id: editingId,
			name: form.name,
			installmentAmountCents: Math.round(Number(form.amount) * 100),
			numInstallments: Number(form.installments),
			startDate: form.startDate,
			endDate: form.endDate || null
		};

		await fetch('/admin/eventos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		saving = false;
		resetForm();
		window.location.reload();
	}

	async function toggleActive(eventId: number, active: boolean) {
		await fetch('/admin/eventos', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: eventId, action: 'toggleActive', active: !active })
		});
		window.location.reload();
	}

	async function setDefault(eventId: number) {
		await fetch('/admin/eventos', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: eventId, action: 'setDefault' })
		});
		window.location.reload();
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold text-gray-800">Eventos</h2>
		<Button onclick={() => { resetForm(); showForm = !showForm; }}>
			{showForm ? 'Cancelar' : '+ Nuevo evento'}
		</Button>
	</div>

	{#if showForm}
		<Card>
			<form onsubmit={submit} class="space-y-4">
				<h3 class="font-semibold text-gray-800">{editingId ? 'Editar evento' : 'Nuevo evento'}</h3>
				<Input label="Nombre" bind:value={form.name} required placeholder="Ej: Cuota mensual 2026" />
				<div class="grid grid-cols-2 gap-4">
					<Input label="Monto por cuota ($)" type="number" bind:value={form.amount} required min="1" step="1" />
					<Input label="Número de cuotas" type="number" bind:value={form.installments} required min="1" />
				</div>
				<div class="grid grid-cols-2 gap-4">
					<Input label="Fecha inicio" type="date" bind:value={form.startDate} required />
					<Input label="Fecha fin" type="date" bind:value={form.endDate} />
				</div>
				<Button type="submit" disabled={saving}>{saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear evento'}</Button>
			</form>
		</Card>
	{/if}

	{#each data.events as event}
		<Card>
			<div class="flex items-start justify-between">
				<div>
					<div class="flex items-center gap-2">
						<a href="/admin/eventos/{event.id}" class="font-semibold text-gray-800 hover:text-primary-600">{event.name}</a>
						<Badge variant={event.active ? 'success' : 'default'}>{event.active ? 'Activo' : 'Inactivo'}</Badge>
						{#if event.isDefault}
							<Badge variant="success">Default</Badge>
						{/if}
					</div>
					<p class="text-sm text-gray-500 mt-1">
						{formatCurrency(event.installmentAmountCents)} × {event.numInstallments} cuota{event.numInstallments > 1 ? 's' : ''}
						= {formatCurrency(event.installmentAmountCents * event.numInstallments)} total
					</p>
					<p class="text-xs text-gray-400 mt-0.5">
						{formatDate(event.startDate)}{event.endDate ? ` — ${formatDate(event.endDate)}` : ''}
					</p>
				</div>
				<div class="flex gap-2">
					<Button variant="ghost" size="sm" onclick={() => startEdit(event)}>Editar</Button>
					{#if !event.isDefault}
						<Button variant="ghost" size="sm" onclick={() => setDefault(event.id)}>
							Marcar default
						</Button>
					{/if}
					<Button variant="ghost" size="sm" onclick={() => toggleActive(event.id, event.active)}>
						{event.active ? 'Desactivar' : 'Activar'}
					</Button>
				</div>
			</div>
		</Card>
	{/each}

	{#if data.events.length === 0}
		<Card>
			<p class="text-center text-sm text-gray-500 py-4">No hay eventos creados</p>
		</Card>
	{/if}
</div>
