import db from '$lib/server/db.js';
import { fail, redirect } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth.js';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { put, del } from '@vercel/blob';

async function requireUser(cookies) {
	const sessionId = cookies.get('session');
	const user = sessionId ? await validateSession(sessionId) : null;

	if (!user) throw redirect(303, '/login');

	return user;
}

// -------------------- LOAD --------------------
export async function load({ cookies }) {
	const user = await requireUser(cookies);

	const [images] = await db.execute(
		`
		SELECT *
		FROM images
		WHERE author_id = ?
		ORDER BY created_at DESC
		`,
		[user.id]
	);

	return {
		user,
		images
	};
}

// -------------------- ACTIONS --------------------
export const actions = {

	// UPLOAD
	upload: async ({ request, cookies }) => {
		const user = await requireUser(cookies);

		const formData = await request.formData();
		const file = formData.get('image');
		const description = formData.get('description')?.trim() || '';

		if (!file || typeof file === 'string' || file.size === 0) {
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
			`
			INSERT INTO images (image, description, author_id)
			VALUES (?, ?, ?)
			`,
			[blob.url, description, user.id]
		);

		return { success: true };
	},

	// DELETE
	delete: async ({ request, cookies }) => {
		const user = await requireUser(cookies);

		const formData = await request.formData();
		const imageId = Number(formData.get('imageId'));

		if (!imageId) {
			return fail(400, { error: 'Invalid image' });
		}

		const [rows] = await db.execute(
			`
			SELECT id, image
			FROM images
			WHERE id = ? AND author_id = ?
			`,
			[imageId, user.id]
		);

		if (rows.length === 0) {
			return fail(403, { error: 'Not allowed' });
		}

		const image = rows[0];

		// 🔥 1. Blob löschen (Vercel Storage)
		try {
			await del(image.image, {
				token: BLOB_READ_WRITE_TOKEN
			});
		} catch (err) {
			console.error('Blob delete failed:', err);
		}

		// 🧹 2. DB löschen
		await db.execute(
			`
			DELETE FROM images
			WHERE id = ?
			`,
			[imageId]
		);

		return { success: true };
	}
};