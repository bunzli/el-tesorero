<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { formatDateTime } from '$lib/utils/format.js';

	let { data } = $props();

	let showForm = $state(false);
	let editingId = $state<number | null>(null);
	let name = $state('');
	let email = $state('');
	let saving = $state(false);
	let error = $state('');

	function resetForm() {
		name = '';
		email = '';
		editingId = null;
		error = '';
		showForm = false;
	}

	function startEdit(member: typeof data.members[0]) {
		editingId = member.id;
		name = member.name;
		email = member.email;
		showForm = true;
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		saving = true;
		error = '';

		const res = await fetch('/admin/miembros', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: editingId, name, email: email.toLowerCase() })
		});

		const result = await res.json();
		saving = false;

		if (result.error) {
			error = result.error;
		} else {
			resetForm();
			window.location.reload();
		}
	}

	async function resetPin(memberId: number) {
		if (!confirm('¿Resetear el PIN de este miembro a 000000?')) return;

		await fetch('/admin/miembros', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: memberId, action: 'resetPin' })
		});

		window.location.reload();
	}

	async function deleteMember(memberId: number) {
		if (!confirm('¿Eliminar este miembro? Esta acción no se puede deshacer.')) return;

		await fetch('/admin/miembros', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: memberId })
		});

		window.location.reload();
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold text-gray-800">Miembros</h2>
			<p class="text-sm text-gray-500">{data.members.length} miembro{data.members.length !== 1 ? 's' : ''} del curso</p>
		</div>
		<Button onclick={() => { resetForm(); showForm = !showForm; }}>
			{showForm ? 'Cancelar' : '+ Nuevo miembro'}
		</Button>
	</div>

	{#if showForm}
		<Card>
			<form onsubmit={submit} class="space-y-4">
				<h3 class="font-semibold text-gray-800">{editingId ? 'Editar miembro' : 'Nuevo miembro'}</h3>
				<Input label="Nombre completo" bind:value={name} required placeholder="Ej: María García" />
				<Input label="Correo electrónico" type="email" bind:value={email} required placeholder="maria@example.com" error={error} />
				{#if !editingId}
					<p class="text-xs text-gray-400">El PIN inicial será 000000. El miembro lo cambiará al ingresar por primera vez.</p>
				{/if}
				<Button type="submit" disabled={saving}>{saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear miembro'}</Button>
			</form>
		</Card>
	{/if}

	<Card padding={false}>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-gray-100 text-left">
						<th class="px-4 py-3 font-medium text-gray-500">Nombre</th>
						<th class="px-4 py-3 font-medium text-gray-500">Correo</th>
						<th class="px-4 py-3 font-medium text-gray-500">Estado PIN</th>
						<th class="px-4 py-3 font-medium text-gray-500 text-right">Acciones</th>
					</tr>
				</thead>
				<tbody>
					{#each data.members as member}
						<tr class="border-b border-gray-50 hover:bg-gray-50">
							<td class="px-4 py-3 font-medium text-gray-800">{member.name}</td>
							<td class="px-4 py-3 text-gray-600">{member.email}</td>
							<td class="px-4 py-3">
								{#if member.mustChangePin}
									<Badge variant="warning">PIN inicial</Badge>
								{:else}
									<Badge variant="success">PIN personalizado</Badge>
								{/if}
							</td>
							<td class="px-4 py-3">
								<div class="flex justify-end gap-1">
									<Button variant="ghost" size="sm" onclick={() => startEdit(member)}>Editar</Button>
									<Button variant="ghost" size="sm" onclick={() => resetPin(member.id)}>Reset PIN</Button>
									<Button variant="ghost" size="sm" onclick={() => deleteMember(member.id)}>
										<span class="text-danger-500">Eliminar</span>
									</Button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</Card>
</div>
