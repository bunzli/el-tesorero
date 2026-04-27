<script lang="ts">
	import { onMount } from 'svelte';
	import PinKeypad from '$lib/components/PinKeypad.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let step = $state<'email' | 'pin'>('email');
	let email = $state('');
	let error = $state('');
	let loading = $state(false);
	let pinError = $state('');

	onMount(() => {
		const saved = localStorage.getItem('last_email');
		if (saved) {
			email = saved;
			step = 'pin';
		}
	});

	async function submitEmail(e: SubmitEvent) {
		e.preventDefault();
		if (!email.trim()) return;
		error = '';
		loading = true;

		const res = await fetch('/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ step: 'email', email: email.trim().toLowerCase() })
		});

		const data = await res.json();
		loading = false;

		if (data.error) {
			error = data.error;
		} else {
			localStorage.setItem('last_email', email.trim().toLowerCase());
			step = 'pin';
		}
	}

	async function submitPin(pin: string) {
		pinError = '';
		loading = true;

		const res = await fetch('/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ step: 'pin', email: email.trim().toLowerCase(), pin })
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

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 p-4">
	<div class="w-full max-w-sm">
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-bold text-primary-700">El Tesorero</h1>
			<p class="mt-1 text-sm text-gray-500">Tesorería del curso</p>
		</div>

		<Card>
			{#if step === 'email'}
				<form onsubmit={submitEmail}>
					<h2 class="mb-4 text-lg font-semibold text-gray-800">Ingresa tu correo</h2>
					<Input
						label="Correo electrónico"
						type="email"
						placeholder="tu@correo.com"
						bind:value={email}
						{error}
						autocomplete="email"
						required
					/>
					<div class="mt-4">
						<Button type="submit" fullWidth disabled={loading}>
							{loading ? 'Verificando...' : 'Continuar'}
						</Button>
					</div>
				</form>
			{:else}
				<div class="text-center">
					<h2 class="mb-1 text-lg font-semibold text-gray-800">Ingresa tu PIN</h2>
					<p class="mb-6 text-sm text-gray-500">{email}</p>
					<PinKeypad onComplete={submitPin} error={pinError} disabled={loading} />
					<button
						type="button"
						class="mt-6 text-sm text-primary-600 hover:underline"
						onclick={() => { step = 'email'; pinError = ''; }}
					>
						Cambiar correo
					</button>
				</div>
			{/if}
		</Card>
	</div>
</div>
