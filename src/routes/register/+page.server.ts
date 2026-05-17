import { fail, redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { Actions, PageServerLoad } from './$types';
import { api } from '$lib/server/api';
import type { User } from '$lib/types';

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) redirect(303, '/profile');
	redirect(303, '/?register=1');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = String(data.get('username') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		const password = String(data.get('password') ?? '');

		if (!username || !email || !password) {
			return fail(400, { username, email, error: 'MISSING_FIELDS' });
		}

		const result = await api<{ token: string; user: User }>('/auth/register', {
			method: 'POST',
			body: { username, email, password }
		});

		if (!result.ok) {
			return fail(result.status || 500, { username, email, error: result.error });
		}

		cookies.set('auth_token', result.data.token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !dev,
			maxAge: COOKIE_MAX_AGE
		});

		redirect(303, '/profile');
	}
};
