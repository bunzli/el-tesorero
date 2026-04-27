<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		label?: string;
		error?: string;
	}

	let { label, error, class: cls = '', value = $bindable(''), ...rest }: Props = $props();
</script>

<label class="block">
	{#if label}
		<span class="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
	{/if}
	<input
		class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-colors placeholder:text-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none {error ? 'border-danger-500' : ''} {cls}"
		bind:value
		{...rest}
	/>
	{#if error}
		<span class="mt-1 block text-xs text-danger-500">{error}</span>
	{/if}
</label>
