<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		padding?: boolean;
		children: Snippet;
	}

	let { class: cls = '', padding = true, children }: Props = $props();
</script>

<div class="rounded-2xl border border-gray-100 bg-white shadow-sm {padding ? 'p-6' : ''} {cls}">
	{@render children()}
</div>
