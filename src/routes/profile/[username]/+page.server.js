import pool from '$lib/server/db';
import { error, fail } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth.js';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export async function load({ params, cookies }) {
	const { username } = params;

	const sessionId = cookies.get('session');
	const user = sessionId ? await validateSession(sessionId) : null;

	const [users] = await pool.execute(
		'SELECT id, username, email, avatar, created_at FROM users WHERE username = ?',
		[username]
	);

	if (users.length === 0) {
		throw error(404, 'User not found');
	}

	const profileUser = users[0];

	const [images] = await pool.execute(
		`
		SELECT 
			i.id,
			i.image,
			i.description, 
			i.votes,
			i.created_at
		FROM images i
		WHERE i.author_id = ?
		ORDER BY i.created_at DESC
		`,
		[profileUser.id]
	);

	return {
		profileUser,
		images,
		user
	};
}

export const actions = {
	avatar: async ({ request, cookies }) => {
		const sessionId = cookies.get('session');
		const user = sessionId ? await validateSession(sessionId) : null;

		if (!user) {
			return fail(401, { error: 'Not logged in' });
		}

		const formData = await request.formData();
		const file = formData.get('avatar');

		if (!file || typeof file === 'string' || file.size === 0) {
			return fail(400, { error: 'Choose an image' });
		}

		const blob = await put(
			`avatars/${user.id}-${Date.now()}`,
			file,
			{
				access: 'public',
				token: BLOB_READ_WRITE_TOKEN
			}
		);

		await pool.execute(
			`UPDATE users SET avatar = ? WHERE id = ?`,
			[blob.url, user.id]
		);

		return { success: true };
	}
};