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

	if (!users.length) {
		throw error(404, 'User not found');
	}

	const profileUser = users[0];

	const [images] = await pool.execute(
		`
		SELECT id, image, description, votes, created_at
		FROM images
		WHERE author_id = ?
		ORDER BY created_at DESC
		`,
		[profileUser.id]
	);

	const [followersCount] = await pool.execute(
		`SELECT COUNT(*) AS count FROM follows WHERE following_id = ?`,
		[profileUser.id]
	);

	const [followingCount] = await pool.execute(
		`SELECT COUNT(*) AS count FROM follows WHERE follower_id = ?`,
		[profileUser.id]
	);

	let isFollowing = false;

	if (user) {
		const [check] = await pool.execute(
			`SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?`,
			[user.id, profileUser.id]
		);

		isFollowing = check.length > 0;
	}

	return {
		profileUser,
		images,
		user,
		followers: followersCount[0].count,
		following: followingCount[0].count,
		isFollowing
	};
}

export const actions = {
	follow: async ({ params, cookies }) => {
		const sessionId = cookies.get('session');
		const user = sessionId ? await validateSession(sessionId) : null;

		if (!user) throw error(401, 'Not logged in');

		const { username } = params;

		const [target] = await pool.execute(
			`SELECT id FROM users WHERE username = ?`,
			[username]
		);

		if (!target.length) throw error(404, 'User not found');

		const targetId = target[0].id;

		if (user.id === targetId) {
			return fail(400, { error: 'Cannot follow yourself' });
		}

		const [existing] = await pool.execute(
			`SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?`,
			[user.id, targetId]
		);

		if (existing.length) {
			await pool.execute(
				`DELETE FROM follows WHERE follower_id = ? AND following_id = ?`,
				[user.id, targetId]
			);
		} else {
			await pool.execute(
				`INSERT INTO follows (follower_id, following_id) VALUES (?, ?)`,
				[user.id, targetId]
			);
		}

		return { success: true };
	},

	avatar: async ({ cookies, request }) => {
		const sessionId = cookies.get('session');
		const user = sessionId ? await validateSession(sessionId) : null;

		if (!user) {
			throw error(401, 'Not logged in');
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