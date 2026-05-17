import { fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';
import { api } from '$lib/server/api';
import type { Category, Product } from '$lib/types';

const BACKEND_URL = env.BACKEND_URL ?? 'http://localhost:3001';

async function uploadProductImage(file: File, token: string | null | undefined): Promise<string> {
	const fd = new FormData();
	fd.append('file', file, file.name || 'image');
	const res = await fetch(`${BACKEND_URL}/admin/uploads/product-image`, {
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
	const [products, categories] = await Promise.all([
		api<Product[]>('/admin/products', { token: locals.token }),
		api<Category[]>('/admin/categories', { token: locals.token })
	]);
	return {
		products: products.ok ? products.data : [],
		categories: categories.ok ? categories.data : [],
		loadError: products.ok && categories.ok ? null : 'LOAD_FAILED'
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const data = await request.formData();
		const sku = String(data.get('sku') ?? '').trim().toUpperCase();
		const name = String(data.get('name') ?? '').trim();
		const categoryId = String(data.get('categoryId') ?? '');
		const price = Number(data.get('price') ?? 0);
		if (!sku || !name || !categoryId) return fail(400, { error: 'MISSING_FIELDS' });

		let image: string | null | undefined;
		const imageFile = data.get('imageFile');
		if (isUploadedFile(imageFile)) {
			try {
				image = await uploadProductImage(imageFile, locals.token);
			} catch (err) {
				return fail(400, { error: err instanceof Error ? err.message : 'UPLOAD_FAILED' });
			}
		}

		const result = await api('/admin/products', {
			method: 'POST',
			token: locals.token,
			body: {
				sku,
				name,
				categoryId,
				price: Number.isFinite(price) ? Math.max(0, Math.floor(price)) : 0,
				duration: String(data.get('duration') ?? '').trim() || undefined,
				description: String(data.get('description') ?? ''),
				image,
				status: String(data.get('status') ?? 'ACTIVE') as 'ACTIVE' | 'DRAFT' | 'SOLD_OUT'
			}
		});
		if (!result.ok) return fail(result.status || 500, { error: result.error });
		return { success: 'PRODUCT_CREATED' };
	},

	update: async ({ request, locals }) => {
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		if (!id) return fail(400, { error: 'MISSING_ID' });

		const body: Record<string, unknown> = {};

		const imageFile = data.get('imageFile');
		if (isUploadedFile(imageFile)) {
			try {
				body.image = await uploadProductImage(imageFile, locals.token);
			} catch (err) {
				return fail(400, { error: err instanceof Error ? err.message : 'UPLOAD_FAILED' });
			}
		} else if (data.get('clearImage') === 'true') {
			body.image = null;
		}

		const fields = ['sku', 'name', 'description', 'duration', 'status', 'categoryId'] as const;
		for (const f of fields) {
			const v = data.get(f);
			if (v !== null) body[f] = f === 'sku' ? String(v).trim().toUpperCase() : String(v).trim();
		}
		const price = data.get('price');
		if (price !== null) {
			const n = Number(price);
			if (Number.isFinite(n)) body.price = Math.max(0, Math.floor(n));
		}

		const result = await api(`/admin/products/${id}`, {
			method: 'PATCH',
			token: locals.token,
			body
		});
		if (!result.ok) return fail(result.status || 500, { error: result.error });
		return { success: 'PRODUCT_UPDATED' };
	},

	delete: async ({ request, locals }) => {
		const data = await request.formData();
		const id = String(data.get('id') ?? '');
		if (!id) return fail(400, { error: 'MISSING_ID' });

		const result = await api(`/admin/products/${id}`, {
			method: 'DELETE',
			token: locals.token
		});
		if (!result.ok) return fail(result.status || 500, { error: result.error });
		return { success: 'PRODUCT_DELETED' };
	}
};
