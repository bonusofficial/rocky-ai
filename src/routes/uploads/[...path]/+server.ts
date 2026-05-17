import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const BACKEND_URL = env.BACKEND_URL ?? 'http://localhost:3001';

export const GET: RequestHandler = async ({ params, fetch, setHeaders }) => {
	const path = params.path ?? '';
	if (path.includes('..')) throw error(400, 'BAD_PATH');

	const res = await fetch(`${BACKEND_URL}/uploads/${path}`);
	if (!res.ok) throw error(res.status, 'NOT_FOUND');

	const ct = res.headers.get('content-type');
	const cc = res.headers.get('cache-control');
	const headers: Record<string, string> = {};
	if (ct) headers['content-type'] = ct;
	if (cc) headers['cache-control'] = cc;
	setHeaders(headers);

	return new Response(res.body, { status: 200 });
};
