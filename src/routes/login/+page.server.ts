import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { Actions, PageServerLoad } from './$types';
import { api } from '$lib/server/api';
import type { User } from '$lib/types';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const load: PageServerLoad = async ({ url, locals }) => {
	if (locals.user) redirect(303, '/profile');
	const redirectTo = url.searchParams.get('redirectTo') ?? '/profile';
	redirect(303, `/?login=1&redirectTo=${encodeURIComponent(redirectTo)}`);
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const identifier = String(data.get('identifier') ?? '').trim();
		const password = String(data.get('password') ?? '');
		const redirectTo = String(
			data.get('redirectTo') ?? url.searchParams.get('redirectTo') ?? '/profile'
		);

		if (!identifier || !password) {
			return fail(400, { identifier, error: 'MISSING_FIELDS' });
		}

		const result = await api<{ token: string; user: User }>('/auth/login', {
			method: 'POST',
			body: { identifier, password }
		});

		if (!result.ok) {
			return fail(result.status || 500, { identifier, error: result.error });
		}

		cookies.set('auth_token', result.data.token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: COOKIE_MAX_AGE
		});

		redirect(303, redirectTo);
	}
};
