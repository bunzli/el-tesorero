<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/login');
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="text-center">
		<h1 class="text-3xl font-bold text-primary-700">El Tesorero</h1>
		<p class="mt-2 text-gray-500">Cargando...</p>
	</div>
</div>
