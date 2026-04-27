import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.isAdmin) {
		redirect(302, '/admin-login');
	}
	return { isAdmin: true };
};
