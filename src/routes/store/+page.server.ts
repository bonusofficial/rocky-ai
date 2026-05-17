import type { PageServerLoad } from './$types';
import { api } from '$lib/server/api';
import type { PublicCategory, Product } from '$lib/types';

export const load: PageServerLoad = async () => {
	const [categories, products] = await Promise.all([
		api<PublicCategory[]>('/categories'),
		api<Product[]>('/products')
	]);
	return {
		categories: categories.ok ? categories.data : [],
		products: products.ok ? products.data : []
	};
};
