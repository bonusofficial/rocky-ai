import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { api } from '$lib/server/api';
import type { StockPool } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
	const result = await api<StockPool[]>('/admin/stock/pools', { token: locals.token });
	return {
		pools: result.ok ? result.data : [],
		loadError: result.ok ? null : result.error
	};
};

export const actions: Actions = {
	add: async ({ request, locals }) => {
		const data = await request.formData();
		const productId = String(data.get('productId') ?? '');
		const raw = String(data.get('items') ?? '');
		const trim = data.get('trim') !== 'false';

		if (!productId) return fail(400, { error: 'PRODUCT_REQUIRED' });

		const items = raw
			.split(/\r?\n/)
			.map((s) => (trim ? s.trim() : s))
			.filter((s) => s.length > 0);

		if (items.length === 0) return fail(400, { error: 'NO_ITEMS' });

		const result = await api<{
			requested: number;
			unique: number;
			inserted: number;
			skipped: number;
		}>('/admin/stock', {
			method: 'POST',
			token: locals.token,
			body: { productId, items }
		});

		if (!result.ok) return fail(result.status || 500, { error: result.error });
		return { success: true, ...result.data };
	}
};
