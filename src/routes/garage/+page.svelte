<script lang="ts">
	import PinKeypad from '$lib/components/PinKeypad.svelte';
	import WalletStatement from '$lib/components/WalletStatement.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	let activeSection = $state('pinKeypad');
	let pinResult = $state('');
	let pinError = $state('');

	const mockMovements = [
		{ id: 1, type: 'credit' as const, amountCents: 500000, description: 'Pago cuota marzo - María García', movementDate: '2026-03-15', runningBalanceCents: 500000, eventName: 'Cuota mensual', memberName: 'María García', transferGroupId: null },
		{ id: 2, type: 'credit' as const, amountCents: 500000, description: 'Pago cuota marzo - Juan Pérez', movementDate: '2026-03-18', runningBalanceCents: 1000000, eventName: 'Cuota mensual', memberName: 'Juan Pérez', transferGroupId: null },
		{ id: 3, type: 'debit' as const, amountCents: 250000, description: 'Compra materiales acto cívico', movementDate: '2026-03-20', runningBalanceCents: 750000, eventName: null, memberName: null, transferGroupId: null },
		{ id: 4, type: 'credit' as const, amountCents: 500000, description: 'Pago cuota abril - María García', movementDate: '2026-04-05', runningBalanceCents: 1250000, eventName: 'Cuota mensual', memberName: 'María García', transferGroupId: null },
		{ id: 5, type: 'debit' as const, amountCents: 300000, description: 'Transferencia a Caja chica', movementDate: '2026-04-10', runningBalanceCents: 950000, eventName: null, memberName: null, transferGroupId: 'abc123' },
	];

	const sections = [
		{ id: 'pinKeypad', label: 'PinKeypad' },
		{ id: 'walletStatement', label: 'WalletStatement' },
		{ id: 'buttons', label: 'Button' },
		{ id: 'inputs', label: 'Input' },
		{ id: 'cards', label: 'Card' },
		{ id: 'badges', label: 'Badge' }
	];
</script>

<div class="min-h-screen bg-gray-100">
	<div class="flex">
		<!-- Sidebar -->
		<aside class="w-56 min-h-screen border-r border-gray-200 bg-white p-4">
			<h1 class="text-lg font-bold text-gray-800 mb-1">Garage</h1>
			<p class="text-xs text-gray-400 mb-4">Component Playground</p>
			<nav class="space-y-1">
				{#each sections as s}
					<button
						class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors
							{activeSection === s.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}"
						onclick={() => activeSection = s.id}
					>
						{s.label}
					</button>
				{/each}
			</nav>
		</aside>

		<!-- Preview -->
		<main class="flex-1 p-8">
			{#if activeSection === 'pinKeypad'}
				<h2 class="text-xl font-bold mb-6">PinKeypad</h2>
				<div class="grid gap-8 md:grid-cols-2">
					<Card>
						<h3 class="text-sm font-medium text-gray-500 mb-4">Default</h3>
						<PinKeypad onComplete={(pin) => pinResult = pin} />
						{#if pinResult}
							<p class="mt-4 text-center text-sm text-gray-600">PIN ingresado: <code class="font-mono bg-gray-100 px-2 py-0.5 rounded">{pinResult}</code></p>
						{/if}
					</Card>
					<Card>
						<h3 class="text-sm font-medium text-gray-500 mb-4">Con error</h3>
						<PinKeypad error="PIN incorrecto" onComplete={() => {}} />
					</Card>
					<Card>
						<h3 class="text-sm font-medium text-gray-500 mb-4">Disabled</h3>
						<PinKeypad disabled={true} onComplete={() => {}} />
					</Card>
				</div>
			{/if}

			{#if activeSection === 'walletStatement'}
				<h2 class="text-xl font-bold mb-6">WalletStatement</h2>
				<div class="max-w-2xl">
					<WalletStatement
						walletName="Cuenta principal"
						initialBalanceCents={0}
						movements={mockMovements}
						onDelete={(id) => alert(`Delete movement ${id}`)}
					/>
				</div>
				<div class="mt-8 max-w-2xl">
					<h3 class="text-sm font-medium text-gray-500 mb-4">Empty state</h3>
					<WalletStatement
						walletName="Monedero vacío"
						initialBalanceCents={5000000}
						movements={[]}
					/>
				</div>
			{/if}

			{#if activeSection === 'buttons'}
				<h2 class="text-xl font-bold mb-6">Button</h2>
				<Card>
					<div class="space-y-6">
						<div>
							<h3 class="text-sm font-medium text-gray-500 mb-3">Variants</h3>
							<div class="flex flex-wrap gap-3">
								<Button variant="primary">Primary</Button>
								<Button variant="secondary">Secondary</Button>
								<Button variant="danger">Danger</Button>
								<Button variant="ghost">Ghost</Button>
							</div>
						</div>
						<div>
							<h3 class="text-sm font-medium text-gray-500 mb-3">Sizes</h3>
							<div class="flex flex-wrap items-center gap-3">
								<Button size="sm">Small</Button>
								<Button size="md">Medium</Button>
								<Button size="lg">Large</Button>
							</div>
						</div>
						<div>
							<h3 class="text-sm font-medium text-gray-500 mb-3">Full width</h3>
							<Button fullWidth>Full Width Button</Button>
						</div>
						<div>
							<h3 class="text-sm font-medium text-gray-500 mb-3">Disabled</h3>
							<Button disabled>Disabled</Button>
						</div>
					</div>
				</Card>
			{/if}

			{#if activeSection === 'inputs'}
				<h2 class="text-xl font-bold mb-6">Input</h2>
				<Card>
					<div class="space-y-4 max-w-sm">
						<Input label="Normal" placeholder="Placeholder..." />
						<Input label="Con error" error="Este campo es requerido" value="bad value" />
						<Input label="Email" type="email" placeholder="tu@correo.com" />
						<Input label="Disabled" disabled value="No editable" />
					</div>
				</Card>
			{/if}

			{#if activeSection === 'cards'}
				<h2 class="text-xl font-bold mb-6">Card</h2>
				<div class="grid gap-4 md:grid-cols-2">
					<Card>
						<h3 class="font-semibold mb-2">Card con padding</h3>
						<p class="text-sm text-gray-500">Contenido default con padding.</p>
					</Card>
					<Card padding={false}>
						<div class="p-6 border-b border-gray-100">
							<h3 class="font-semibold">Card sin padding</h3>
						</div>
						<div class="p-6">
							<p class="text-sm text-gray-500">Secciones custom.</p>
						</div>
					</Card>
				</div>
			{/if}

			{#if activeSection === 'badges'}
				<h2 class="text-xl font-bold mb-6">Badge</h2>
				<Card>
					<div class="flex flex-wrap gap-3">
						<Badge>Default</Badge>
						<Badge variant="success">Aprobado</Badge>
						<Badge variant="warning">Pendiente</Badge>
						<Badge variant="danger">Rechazado</Badge>
					</div>
				</Card>
			{/if}
		</main>
	</div>
</div>
