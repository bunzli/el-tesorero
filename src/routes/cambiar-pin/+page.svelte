<script lang="ts">
	import PinKeypad from '$lib/components/PinKeypad.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let step = $state<'new' | 'confirm'>('new');
	let newPin = $state('');
	let pinError = $state('');
	let loading = $state(false);

	function handleNewPin(pin: string) {
		newPin = pin;
		step = 'confirm';
	}

	async function handleConfirm(pin: string) {
		if (pin !== newPin) {
			pinError = 'Los PINs no coinciden';
			step = 'new';
			newPin = '';
			return;
		}

		loading = true;
		const res = await fetch('/cambiar-pin', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ pin })
		});

		const data = await res.json();
		loading = false;

		if (data.error) {
			pinError = data.error;
			step = 'new';
			newPin = '';
		} else {
			window.location.href = '/mi-cuenta';
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 p-4">
	<div class="w-full max-w-sm">
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-bold text-primary-700">Cambiar PIN</h1>
			<p class="mt-1 text-sm text-gray-500">Elige un nuevo PIN de 6 dígitos</p>
		</div>

		<Card>
			<div class="text-center">
				{#if step === 'new'}
					<h2 class="mb-6 text-lg font-semibold text-gray-800">Nuevo PIN</h2>
					<PinKeypad onComplete={handleNewPin} error={pinError} disabled={loading} />
				{:else}
					<h2 class="mb-6 text-lg font-semibold text-gray-800">Confirma tu PIN</h2>
					<PinKeypad onComplete={handleConfirm} error={pinError} disabled={loading} />
					<button
						type="button"
						class="mt-6 text-sm text-primary-600 hover:underline"
						onclick={() => { step = 'new'; newPin = ''; pinError = ''; }}
					>
						Reintentar
					</button>
				{/if}
			</div>
		</Card>
	</div>
</div>
