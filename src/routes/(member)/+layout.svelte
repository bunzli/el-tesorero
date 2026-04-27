<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';

	let { children, data } = $props();

	const nav = [
		{ href: '/mi-cuenta', label: 'Inicio', icon: 'home' },
		{ href: '/comprobantes/nuevo', label: 'Pagar', icon: 'upload' }
	];
</script>

<div class="min-h-screen bg-gray-50 pb-20">
	<!-- Top bar -->
	<header class="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
		<div class="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
			<h1 class="text-lg font-bold text-primary-700">El Tesorero</h1>
			<span class="text-sm text-gray-500">{data.member.name}</span>
		</div>
	</header>

	<!-- Content -->
	<main class="mx-auto max-w-lg px-4 py-6">
		{@render children()}
	</main>

	<!-- Bottom nav -->
	<nav class="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-100 bg-white/90 backdrop-blur-md">
		<div class="mx-auto flex max-w-lg">
			{#each nav as item}
				<a
					href={item.href}
					class="flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors
						{$page.url.pathname.startsWith(item.href) ? 'text-primary-600 font-medium' : 'text-gray-400'}"
				>
					{#if item.icon === 'home'}
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
						</svg>
					{/if}
					{item.label}
				</a>
			{/each}
			<a
				href="/login"
				class="flex flex-1 flex-col items-center gap-1 py-3 text-xs text-gray-400"
				onclick={async (e) => {
					e.preventDefault();
					await fetch('/logout', { method: 'POST' });
					window.location.href = '/login';
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
				</svg>
				Salir
			</a>
		</div>
	</nav>
</div>
