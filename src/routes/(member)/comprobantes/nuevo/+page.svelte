<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { formatCurrency, todayStr } from '$lib/utils/format.js';

	let { data } = $props();

	// eslint-disable-next-line svelte/state_referenced_locally
	let eventId = $state((() => data.defaultEventId ? String(data.defaultEventId) : '')());
	let amount = $state('');
	let transferDate = $state(todayStr());
	let message = $state('');
	let file = $state<File | null>(null);
	let saving = $state(false);
	let success = $state(false);
	let error = $state('');
	let dragOver = $state(false);

	function handleFile(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files?.[0]) {
			file = input.files[0];
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		if (e.dataTransfer?.files?.[0]) {
			file = e.dataTransfer.files[0];
		}
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		if (!file || !eventId) return;

		saving = true;
		error = '';

		const formData = new FormData();
		formData.append('file', file);
		formData.append('eventId', eventId);
		formData.append('amountCents', String(Math.round(Number(amount) * 100)));
		formData.append('transferDate', transferDate);
		formData.append('message', message);

		const res = await fetch('/comprobantes/nuevo', {
			method: 'POST',
			body: formData
		});

		const result = await res.json();
		saving = false;

		if (result.error) {
			error = result.error;
		} else {
			success = true;
		}
	}

	const selectedEvent = $derived(data.events.find((e) => String(e.id) === eventId));
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-xl font-bold text-gray-800">Subir comprobante</h2>
		<p class="text-sm text-gray-500">Adjunta tu comprobante de pago</p>
	</div>

	{#if success}
		<Card class="bg-success-50 border-success-500/20">
			<div class="text-center py-4">
				<div class="w-12 h-12 rounded-full bg-success-500 text-white flex items-center justify-center mx-auto mb-3 text-xl">✓</div>
				<h3 class="font-semibold text-success-600">Comprobante enviado</h3>
				<p class="text-sm text-gray-600 mt-1">Tu comprobante será revisado por el tesorero</p>
				<div class="mt-4 flex gap-3 justify-center">
					<a href="/mi-cuenta">
						<Button variant="secondary" size="sm">Ir a mi cuenta</Button>
					</a>
					<Button size="sm" onclick={() => { success = false; file = null; amount = ''; message = ''; eventId = ''; }}>
						Subir otro
					</Button>
				</div>
			</div>
		</Card>
	{:else}
		<form onsubmit={submit} class="space-y-4">
			<!-- Event selector -->
			<Card>
				<label class="block">
					<span class="mb-1.5 block text-sm font-medium text-gray-700">¿A qué evento pagas?</span>
					<select
						bind:value={eventId}
						class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none"
						required
					>
						<option value="">Seleccionar evento...</option>
						{#each data.events as ev}
							<option value={ev.id}>{ev.name} — {formatCurrency(ev.installmentAmountCents)}/cuota</option>
						{/each}
					</select>
				</label>
			</Card>

			<!-- Amount and date -->
			<Card>
				<div class="space-y-4">
					<Input label="Monto transferido ($)" type="number" bind:value={amount} required min="1" step="1" placeholder="Ej: 5000" />
					<Input label="Fecha de transferencia" type="date" bind:value={transferDate} required />
					<Input label="Mensaje (opcional)" bind:value={message} placeholder="Ej: Pago cuota marzo y abril" />
				</div>
			</Card>

			<!-- File upload -->
			<Card>
				<span class="mb-2 block text-sm font-medium text-gray-700">Comprobante</span>
				<div
					class="relative rounded-xl border-2 border-dashed transition-colors
						{dragOver ? 'border-primary-400 bg-primary-50' : 'border-gray-200'}
						{file ? 'border-success-400 bg-success-50' : ''}"
					role="button"
					tabindex="0"
					ondragover={(e) => { e.preventDefault(); dragOver = true; }}
					ondragleave={() => dragOver = false}
					ondrop={handleDrop}
				>
					<label class="flex flex-col items-center justify-center py-8 cursor-pointer">
						{#if file}
							<div class="text-success-600 text-center">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<p class="text-sm font-medium">{file.name}</p>
								<p class="text-xs text-gray-500 mt-0.5">{(file.size / 1024).toFixed(0)} KB</p>
							</div>
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
							</svg>
							<p class="text-sm text-gray-500">Toca para seleccionar o arrastra tu comprobante</p>
							<p class="text-xs text-gray-400 mt-1">PNG, JPG o PDF</p>
						{/if}
						<input type="file" class="hidden" accept="image/*,.pdf" onchange={handleFile} required={!file} />
					</label>
				</div>
			</Card>

			{#if error}
				<p class="text-sm text-danger-500">{error}</p>
			{/if}

			<Button type="submit" fullWidth size="lg" disabled={saving || !file || !eventId || !amount}>
				{saving ? 'Enviando...' : 'Enviar comprobante'}
			</Button>
		</form>
	{/if}
</div>
