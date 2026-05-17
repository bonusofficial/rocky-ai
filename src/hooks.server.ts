import type { Handle } from '@sveltejs/kit';
import { api } from '$lib/server/api';
import type { User } from '$lib/types';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('auth_token') ?? null;
	event.locals.token = token;
	event.locals.user = null;

	if (token) {
		const result = await api<User>('/auth/me', { method: 'GET', token });
		if (result.ok) {
			event.locals.user = result.data;
		} else if (result.status === 401 || result.status === 404) {
			event.cookies.delete('auth_token', { path: '/' });
			event.locals.token = null;
		}
	}

	return resolve(event);
};
