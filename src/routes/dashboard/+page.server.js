import db from '$lib/server/db.js';
import { fail, redirect } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth.js';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { put } from '@vercel/blob';

export async function load({ cookies }) {
	const sessionId = cookies.get('session');
	const user = sessionId ? await validateSession(sessionId) : null;

	if (!user) throw redirect(303, '/login');

	const [images] = await db.execute(
		'SELECT * FROM images WHERE author_id = ? ORDER BY created_at DESC',
		[user.user_id]
	);

	return { user, images };
}

export const actions = {
	upload: async ({ request, cookies }) => {
		const sessionId = cookies.get('session');
		const user = sessionId ? await validateSession(sessionId) : null;

		if (!user) throw redirect(303, '/login');

		const formData = await request.formData();
		const file = formData.get('image');
		const description = formData.get('description')?.trim() || '';

		if (!file || file.size === 0) {
			return fail(400, { error: 'Bitte Bild auswählen' });
		}

		if (!file.type.startsWith('image/')) {
			return fail(400, { error: 'Nur Bilder erlaubt' });
		}

		const blob = await put(file.name, file, {
			access: 'public',
			token: BLOB_READ_WRITE_TOKEN
		});

		await db.execute(
			'INSERT INTO images (image, description, author_id) VALUES (?, ?, ?)',
			[blob.url, description, user.user_id]
		);

		return { success: true };
	}
};