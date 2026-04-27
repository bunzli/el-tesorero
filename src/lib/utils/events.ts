/**
 * Returns the number of installments that should have been paid by today
 * for a given event, based on its date range and installment count.
 *
 * - If the event hasn't started yet: 0
 * - If there's an endDate: distribute installments linearly across the period
 * - If there's no endDate: assume monthly cadence from startDate
 */
export function installmentsDueByNow(event: {
	startDate: string;
	endDate?: string | null;
	numInstallments: number;
}): number {
	const now = new Date();
	const start = new Date(event.startDate + 'T12:00:00');

	if (now < start) return 0;
	if (event.numInstallments === 1) return 1;

	if (event.endDate) {
		const end = new Date(event.endDate + 'T12:00:00');
		if (now >= end) return event.numInstallments;

		// Installment i (0-indexed) is due at: start + i * interval
		// where interval = (end - start) / (numInstallments - 1)
		const interval = (end.getTime() - start.getTime()) / (event.numInstallments - 1);
		const elapsed = now.getTime() - start.getTime();
		return Math.min(event.numInstallments, Math.floor(elapsed / interval) + 1);
	} else {
		// No end date: one installment per month
		const monthsElapsed =
			(now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
		return Math.min(event.numInstallments, monthsElapsed + 1);
	}
}
