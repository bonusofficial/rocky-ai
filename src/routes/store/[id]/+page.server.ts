import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { api } from '$lib/server/api';
import type { Product } from '$lib/types';

export const load: PageServerLoad = async ({ params }) => {
	const result = await api<Product>(`/products/${params.id}`);
	if (!result.ok) {
		if (result.status === 404) error(404, 'Product not found');
		error(result.status || 500, result.error);
	}
	return { product: result.data };
};
