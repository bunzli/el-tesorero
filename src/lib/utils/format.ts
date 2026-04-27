export function formatCurrency(cents: number): string {
	const amount = cents / 100;
	return new Intl.NumberFormat('es-CL', {
		style: 'currency',
		currency: 'CLP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(amount);
}

export function formatDate(dateStr: string): string {
	const date = new Date(dateStr + 'T12:00:00');
	return new Intl.DateTimeFormat('es-CL', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	}).format(date);
}

export function formatDateTime(dateStr: string): string {
	const date = new Date(dateStr);
	return new Intl.DateTimeFormat('es-CL', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(date);
}

export function toInputDate(dateStr: string): string {
	return dateStr.slice(0, 10);
}

export function todayStr(): string {
	return new Date().toISOString().slice(0, 10);
}
