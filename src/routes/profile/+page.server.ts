import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { api } from '$lib/server/api';
import type { User } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		redirect(303, '/?login=1&redirectTo=/profile');
	}
	return { user: locals.user };
};

export const actions: Actions = {
	updateAccount: async ({ request, locals }) => {
		if (!locals.user || !locals.token) {
			return fail(401, { error: 'UNAUTHORIZED' });
		}

		const data = await request.formData();
		const payload: Record<string, string> = {};
		const username = String(data.get('username') ?? '').trim();
		const email = String(data.get('email') ?? '').trim();
		if (username) payload.username = username;
		if (email) payload.email = email;

		if (Object.keys(payload).length === 0) {
			return fail(400, { error: 'NO_FIELDS' });
		}

		const result = await api<User>('/profile', {
			method: 'PATCH',
			token: locals.token,
			body: payload
		});

		if (!result.ok) {
			return fail(result.status || 500, { error: result.error });
		}

		return { success: true, user: result.data };
	},

	changePassword: async ({ request, locals }) => {
		if (!locals.user || !locals.token) {
			return fail(401, { error: 'UNAUTHORIZED' });
		}

		const data = await request.formData();
		const currentPassword = String(data.get('currentPassword') ?? '');
		const newPassword = String(data.get('newPassword') ?? '');

		if (!currentPassword || !newPassword) {
			return fail(400, { error: 'MISSING_FIELDS' });
		}

		const result = await api<{ ok: true }>('/profile/password', {
			method: 'POST',
			token: locals.token,
			body: { currentPassword, newPassword }
		});

		if (!result.ok) {
			return fail(result.status || 500, { error: result.error });
		}

		return { success: true, passwordChanged: true };
	}
};
