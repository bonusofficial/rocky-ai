import { env } from '$env/dynamic/private';

const BACKEND_URL = env.BACKEND_URL ?? 'http://localhost:3001';

export type ApiResult<T> =
	| { ok: true; data: T }
	| { ok: false; status: number; error: string };

interface ApiInit extends Omit<RequestInit, 'body'> {
	token?: string | null;
	body?: unknown;
}

/**
 * Server-side fetch helper for the Elysia backend.
 * Always called from `+page.server.ts`, `+server.ts`, or `hooks.server.ts` —
 * never bundled into client code.
 */
export async function api<T>(path: string, init: ApiInit = {}): Promise<ApiResult<T>> {
	const headers = new Headers(init.headers);
	if (init.body !== undefined && !headers.has('content-type')) {
		headers.set('content-type', 'application/json');
	}
	if (init.token) {
		headers.set('authorization', `Bearer ${init.token}`);
	}

	let res: Response;
	try {
		res = await fetch(`${BACKEND_URL}${path}`, {
			...init,
			headers,
			body: init.body === undefined ? undefined : JSON.stringify(init.body)
		});
	} catch (err) {
		return {
			ok: false,
			status: 0,
			error: err instanceof Error ? `BACKEND_UNREACHABLE: ${err.message}` : 'BACKEND_UNREACHABLE'
		};
	}

	const text = await res.text();
	let parsed: unknown = null;
	if (text) {
		try {
			parsed = JSON.parse(text);
		} catch {
			parsed = text;
		}
	}

	if (!res.ok) {
		const error =
			parsed && typeof parsed === 'object' && 'error' in parsed
				? String((parsed as { error: unknown }).error)
				: `HTTP_${res.status}`;
		return { ok: false, status: res.status, error };
	}

	return { ok: true, data: parsed as T };
}
