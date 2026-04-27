<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'success' | 'warning' | 'danger';
		children: Snippet;
	}

	let { variant = 'default', children }: Props = $props();

	const variants: Record<string, string> = {
		default: 'bg-gray-100 text-gray-700',
		success: 'bg-success-50 text-success-600',
		warning: 'bg-warning-50 text-warning-600',
		danger: 'bg-danger-50 text-danger-600'
	};
</script>

<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {variants[variant]}">
	{@render children()}
</span>
