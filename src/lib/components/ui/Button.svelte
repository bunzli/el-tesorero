<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		fullWidth?: boolean;
		children: Snippet;
	}

	let { variant = 'primary', size = 'md', fullWidth = false, children, class: cls = '', ...rest }: Props = $props();

	const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

	const variants: Record<string, string> = {
		primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
		secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
		danger: 'bg-danger-500 text-white hover:bg-danger-600',
		ghost: 'text-gray-600 hover:bg-gray-100'
	};

	const sizes: Record<string, string> = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2.5 text-sm',
		lg: 'px-6 py-3 text-base'
	};
</script>

<button
	class="{base} {variants[variant]} {sizes[size]} {fullWidth ? 'w-full' : ''} {cls}"
	{...rest}
>
	{@render children()}
</button>
