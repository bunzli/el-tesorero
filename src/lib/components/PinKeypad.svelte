<script lang="ts">
	interface Props {
		length?: number;
		onComplete?: (pin: string) => void;
		error?: string;
		disabled?: boolean;
	}

	let { length = 6, onComplete, error = '', disabled = false }: Props = $props();

	let digits = $state<string[]>([]);

	function press(digit: string) {
		if (disabled || digits.length >= length) return;
		digits = [...digits, digit];
		if (digits.length === length) {
			onComplete?.(digits.join(''));
		}
	}

	function backspace() {
		if (disabled || digits.length === 0) return;
		digits = digits.slice(0, -1);
	}

	export function reset() {
		digits = [];
	}

	const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
</script>

<div class="flex flex-col items-center gap-8">
	<!-- PIN dots -->
	<div class="flex gap-3">
		{#each Array(length) as _, i}
			<div
				class="h-4 w-4 rounded-full transition-all duration-200
					{i < digits.length ? 'bg-primary-600 scale-110' : 'bg-gray-200'}
					{error && digits.length === length ? 'bg-danger-500 animate-shake' : ''}"
			></div>
		{/each}
	</div>

	{#if error}
		<p class="text-sm text-danger-500 -mt-4">{error}</p>
	{/if}

	<!-- Keypad grid -->
	<div class="grid grid-cols-3 gap-3 w-full max-w-[280px]">
		{#each keys as key}
			{#if key === ''}
				<div></div>
			{:else if key === 'del'}
				<button
					type="button"
					aria-label="Borrar"
					class="flex items-center justify-center h-16 rounded-2xl text-gray-500 transition-all duration-100
						active:bg-gray-100 active:scale-90
						disabled:opacity-30"
					onclick={backspace}
					{disabled}
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414A2 2 0 0110.828 5H21a1 1 0 011 1v12a1 1 0 01-1 1H10.828a2 2 0 01-1.414-.586L3 12z" />
					</svg>
				</button>
			{:else}
				<button
					type="button"
					class="flex items-center justify-center h-16 rounded-2xl bg-white border border-gray-100 text-2xl font-semibold text-gray-800 shadow-sm
						transition-all duration-100
						hover:bg-gray-50 active:bg-primary-50 active:border-primary-200 active:scale-90 active:shadow-none
						disabled:opacity-30"
					onclick={() => press(key)}
					{disabled}
				>
					{key}
				</button>
			{/if}
		{/each}
	</div>
</div>

<style>
	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		20%, 60% { transform: translateX(-6px); }
		40%, 80% { transform: translateX(6px); }
	}
	:global(.animate-shake) {
		animation: shake 0.4s ease-in-out;
	}
</style>
