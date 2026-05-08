<script lang="ts">
	let downloading = $state(false);
	let error = $state('');

	async function handleExport() {
		downloading = true;
		error = '';
		try {
			const response = await fetch('/admin/exportar');
			if (!response.ok) throw new Error('Error al exportar los datos');

			const blob = await response.blob();
			const disposition = response.headers.get('Content-Disposition') ?? '';
			const match = disposition.match(/filename="([^"]+)"/);
			const filename = match ? match[1] : 'tesorero-backup.json';

			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			a.click();
			URL.revokeObjectURL(url);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Error desconocido';
		} finally {
			downloading = false;
		}
	}
</script>

<div class="space-y-6">
	<h2 class="text-2xl font-bold text-gray-800">Exportar datos</h2>

	<div class="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
		<p class="text-gray-600">
			Descarga un archivo JSON con todos los datos del sistema: miembros, eventos, billeteras,
			movimientos y comprobantes. El archivo puede usarse para respaldar la información.
		</p>

		<ul class="text-sm text-gray-500 space-y-1 list-disc list-inside">
			<li>Miembros</li>
			<li>Eventos</li>
			<li>Billeteras</li>
			<li>Movimientos de billetera</li>
			<li>Comprobantes de pago</li>
		</ul>

		{#if error}
			<p class="text-sm text-red-600">{error}</p>
		{/if}

		<button
			onclick={handleExport}
			disabled={downloading}
			class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium
				hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
		>
			{#if downloading}
				Exportando…
			{:else}
				Descargar backup
			{/if}
		</button>
	</div>
</div>
