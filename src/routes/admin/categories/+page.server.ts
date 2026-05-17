import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';
import { api } from '$lib/server/api';
import type { Category } from '$lib/types';

const BACKEND_URL = env.BACKEND_URL ?? 'http://localhost:3001';

async function uploadIcon(file: File, token: string | null | undefined): Promise<string> {
	const fd = new FormData();
	fd.append('file', file, file.name || 'icon');
	const res = await fetch(`${BACKEND_URL}/admin/uploads/category-icon`, {
		method: 'POST',
		headers: token ? { authorization: `Bearer ${token}` } : undefined,
		body: fd
	});
	const text = await res.text();
	let parsed: unknown = null;
	try {
		parsed = text ? JSON.parse(text) : null;
	} catch {
		parsed = null;
	}
	if (!res.ok) {
		const err =
			parsed && typeof parsed === 'object' && 'error' in parsed
				? String((parsed as { error: unknown }).error)
				: `UPLOAD_HTTP_${res.status}`;
		throw new Error(err);
	}
	const url = (parsed as { url?: string } | null)?.url;
	if (!url) throw new Error('UPLOAD_NO_URL');
	return url;
}

function isUploadedFile(v: FormDataEntryValue | null): v is File {
	return v instanceof File && v.size > 0;
}

export const load: PageServerLoad = async ({ locals }) => {
	const result = await api<Category[]>('/admin/categories', { token: locals.token });
	return {
		categories: result.ok ? result.data : [],
		loadError: result.ok ? null : result.error
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		if (!name) return fail(400, { error: 'NAME_REQUIRED' });

		let icon: string | undefined;
		const iconFile = data.get('iconFile');
		if (isUploadedFile(iconFile)) {
			try {
				icon = await uploadIcon(iconFile, locals.token);
			} catch (err) {
				return fail(400, { error: err instanceof Error ? err.message : 'UPLOAD_FAILED' });
			}
		} else {
			const iconText = String(data.get('icon') ?? '').trim();
			if (iconText) icon = iconText;
		}

		const payload = {
			name,
			slug: String(data.get('slug') ?? '').trim() || undefined,
			icon,
			description: String(data.get('description') ?? '').trim() || undefined,
			visible: data.get('visible') !== 'false'
		};

		const result = await api('/admin/categories', {
			method: 'POST',
			token: locals.token,
			body: payload
		});
		if (!result.ok) return fail(result.status || 500, { error: result.error });
		return { success: 'CATEGORY_CREATED' };
	},

	update: async ({ request, locals }) => {
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		if (!id) return fail(400, { error: 'MISSING_ID' });

		const body: Record<string, unknown> = {};

		const iconFile = data.get('iconFile');
		if (isUploadedFile(iconFile)) {
			try {
				body.icon = await uploadIcon(iconFile, locals.token);
			} catch (err) {
				return fail(400, { error: err instanceof Error ? err.message : 'UPLOAD_FAILED' });
			}
		} else if (data.get('icon') !== null) {
			body.icon = String(data.get('icon')).trim();
		}

		const name = data.get('name');
		const slug = data.get('slug');
		const description = data.get('description');
		const visible = data.get('visible');
		if (name !== null) body.name = String(name).trim();
		if (slug !== null) body.slug = String(slug).trim();
		if (description !== null) body.description = String(description);
		if (visible !== null) body.visible = visible === 'true';

		const result = await api(`/admin/categories/${id}`, {
			method: 'PATCH',
			token: locals.token,
			body
		});
		if (!result.ok) return fail(result.status || 500, { error: result.error });
		return { success: 'CATEGORY_UPDATED' };
	},

	toggleVisibility: async ({ request, locals }) => {
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		const visible = data.get('visible') === 'true';
		if (!id) return fail(400, { error: 'MISSING_ID' });

		const result = await api(`/admin/categories/${id}`, {
			method: 'PATCH',
			token: locals.token,
			body: { visible: !visible }
		});
		if (!result.ok) return fail(result.status || 500, { error: result.error });
		return { success: 'VISIBILITY_TOGGLED' };
	},

	reorder: async ({ request, locals }) => {
		const data = await request.formData();
		const ids = String(data.get('ids') ?? '').split(',').filter(Boolean);
		if (ids.length === 0) return fail(400, { error: 'MISSING_IDS' });

		const result = await api('/admin/categories/reorder', {
			method: 'POST',
			token: locals.token,
			body: { ids }
		});
		if (!result.ok) return fail(result.status || 500, { error: result.error });
		return { success: 'REORDERED' };
	},

	delete: async ({ request, locals }) => {
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		if (!id) return fail(400, { error: 'MISSING_ID' });

		const result = await api(`/admin/categories/${id}`, {
			method: 'DELETE',
			token: locals.token
		});
		if (!result.ok) return fail(result.status || 500, { error: result.error });
		return { success: 'CATEGORY_DELETED' };
	}
};
