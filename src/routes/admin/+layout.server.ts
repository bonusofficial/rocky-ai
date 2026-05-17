import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		redirect(303, `/?login=1&redirectTo=${encodeURIComponent(url.pathname)}`);
	}
	if (locals.user.rank !== 'Admin') {
		error(403, 'Admin access required');
	}
	return { user: locals.user };
};
