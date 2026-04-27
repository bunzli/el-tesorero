<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();

	const nav = [
		{ href: '/admin', label: 'Inicio', exact: true },
		{ href: '/admin/miembros', label: 'Miembros' },
		{ href: '/admin/eventos', label: 'Eventos' },
		{ href: '/admin/monederos', label: 'Monederos' },
		{ href: '/admin/comprobantes', label: 'Comprobantes' }
	];

	function isActive(href: string, exact: boolean = false): boolean {
		if (exact) return $page.url.pathname === href;
		return $page.url.pathname.startsWith(href);
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Sidebar (desktop) + top bar (mobile) -->
	<div class="lg:flex">
		<!-- Sidebar -->
		<aside class="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-gray-200 bg-white">
			<div class="flex flex-col flex-1 overflow-y-auto">
				<div class="px-6 py-5 border-b border-gray-100">
					<h1 class="text-xl font-bold text-primary-700">El Tesorero</h1>
					<p class="text-xs text-gray-500 mt-0.5">Panel de administración</p>
				</div>
				<nav class="flex-1 px-3 py-4 space-y-1">
					{#each nav as item}
						<a
							href={item.href}
							class="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
								{isActive(item.href, item.exact) ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}"
						>
							{item.label}
						</a>
					{/each}
				</nav>
				<div class="px-3 py-4 border-t border-gray-100">
					<a
						href="/admin-login"
						class="flex items-center px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50"
						onclick={async (e) => {
							e.preventDefault();
							await fetch('/logout', { method: 'POST' });
							window.location.href = '/admin-login';
						}}
					>
						Cerrar sesión
					</a>
				</div>
			</div>
		</aside>

		<!-- Mobile top bar -->
		<header class="lg:hidden sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
			<div class="px-4 py-3">
				<h1 class="text-lg font-bold text-primary-700">El Tesorero <span class="text-xs font-normal text-gray-400">Admin</span></h1>
			</div>
			<nav class="flex overflow-x-auto px-4 gap-1 pb-2">
				{#each nav as item}
					<a
						href={item.href}
						class="whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
							{isActive(item.href, item.exact) ? 'bg-primary-50 text-primary-700' : 'text-gray-500'}"
					>
						{item.label}
					</a>
				{/each}
			</nav>
		</header>

		<!-- Main content -->
		<main class="lg:pl-64 flex-1">
			<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{@render children()}
			</div>
		</main>
	</div>
</div>
