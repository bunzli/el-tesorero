<script lang="ts">
	import PinKeypad from '$lib/components/PinKeypad.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let pinError = $state('');
	let loading = $state(false);

	async function submitPin(pin: string) {
		pinError = '';
		loading = true;

		const res = await fetch('/admin-login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ pin })
		});

		const data = await res.json();
		loading = false;

		if (data.error) {
			pinError = data.error;
		} else if (data.redirect) {
			window.location.href = data.redirect;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4">
	<div class="w-full max-w-sm">
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-bold text-white">Administración</h1>
			<p class="mt-1 text-sm text-gray-400">El Tesorero</p>
		</div>

		<Card>
			<div class="text-center">
				<h2 class="mb-1 text-lg font-semibold text-gray-800">PIN de administrador</h2>
				<p class="mb-6 text-sm text-gray-500">Ingresa el PIN de acceso</p>
				<PinKeypad onComplete={submitPin} error={pinError} disabled={loading} />
			</div>
		</Card>
	</div>
</div>
