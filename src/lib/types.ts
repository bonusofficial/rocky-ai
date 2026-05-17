export type Rank = 'Member' | 'Admin';
export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'SOLD_OUT';

export interface User {
	id: string;
	username: string;
	email: string;
	credit: number;
	totalCredit: number;
	rank: Rank;
	createdAt: string;
	updatedAt: string;
}

export interface Category {
	id: string;
	name: string;
	slug: string;
	icon: string;
	description: string;
	position: number;
	visible: boolean;
	productCount: number;
}

export interface PublicCategory {
	id: string;
	name: string;
	slug: string;
	icon: string;
	description: string;
	productCount: number;
}

export interface Product {
	id: string;
	sku: string;
	name: string;
	description: string;
	price: number;
	duration: string;
	image: string | null;
	status: ProductStatus;
	category: { id: string; slug: string; name: string };
	availableStock: number;
	createdAt?: string;
}

export interface StockPool {
	id: string;
	sku: string;
	name: string;
	available: number;
	sold: number;
}
