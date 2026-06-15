import pool from '$lib/server/db.js';
import { validateSession } from '$lib/server/auth.js';
import { fail } from '@sveltejs/kit';

export async function load({ cookies }) {
	const sessionId = cookies.get('session');

	let user = null;

	if (sessionId) {
		user = await validateSession(sessionId);
	}

	const [images] = await pool.execute(`
		SELECT
			i.id,
			i.image,
			i.description,
			i.votes,
			i.created_at,
			i.author_id,
			u.username AS author,
			COUNT(sp.image_id) AS saves
		FROM images i
		INNER JOIN users u
			ON i.author_id = u.id
		LEFT JOIN saved_posts sp
			ON sp.image_id = i.id
		GROUP BY i.id
		ORDER BY i.votes DESC, i.created_at DESC
		LIMIT 25
	`);

	let savedIds = [];
	let votedIds = [];
	let followingIds = [];

	if (user) {
		const [saved] = await pool.execute(
			`SELECT image_id FROM saved_posts WHERE user_id = ?`,
			[user.id]
		);

		savedIds = saved.map((r) => r.image_id);

		const [voted] = await pool.execute(
			`SELECT image_id FROM image_votes WHERE user_id = ?`,
			[user.id]
		);

		votedIds = voted.map((r) => r.image_id);

		const [following] = await pool.execute(
			`SELECT following_id FROM follows WHERE follower_id = ?`,
			[user.id]
		);

		followingIds = following.map((r) => r.following_id);
	}

	return {
		images,
		user,
		savedIds,
		votedIds,
		followingIds
	};
}

export const actions = {
	save: async ({ request, cookies }) => {
		const sessionId = cookies.get('session');
		const user = sessionId ? await validateSession(sessionId) : null;

		if (!user) {
			return fail(401, { error: 'Not logged in' });
		}

		const form = await request.formData();
		const imageId = Number(form.get('imageId'));

		await pool.execute(
			`INSERT IGNORE INTO saved_posts (user_id, image_id)
			 VALUES (?, ?)`,
			[user.id, imageId]
		);

		return { saved: true };
	},

	unsave: async ({ request, cookies }) => {
		const sessionId = cookies.get('session');
		const user = sessionId ? await validateSession(sessionId) : null;

		if (!user) {
			return fail(401, { error: 'Not logged in' });
		}

		const form = await request.formData();
		const imageId = Number(form.get('imageId'));

		await pool.execute(
			`DELETE FROM saved_posts
			 WHERE user_id = ? AND image_id = ?`,
			[user.id, imageId]
		);

		return { saved: false };
	},

	vote: async ({ request, cookies }) => {
		const sessionId = cookies.get('session');
		const user = sessionId ? await validateSession(sessionId) : null;

		if (!user) {
			return fail(401, { error: 'Not logged in' });
		}

		const form = await request.formData();
		const imageId = Number(form.get('imageId'));

		const [existing] = await pool.execute(
			`SELECT 1
			 FROM image_votes
			 WHERE user_id = ? AND image_id = ?`,
			[user.id, imageId]
		);

		if (existing.length > 0) {
			await pool.execute(
				`DELETE FROM image_votes
				 WHERE user_id = ? AND image_id = ?`,
				[user.id, imageId]
			);

			await pool.execute(
				`UPDATE images
				 SET votes = votes - 1
				 WHERE id = ?`,
				[imageId]
			);
		} else {
			await pool.execute(
				`INSERT INTO image_votes (user_id, image_id)
				 VALUES (?, ?)`,
				[user.id, imageId]
			);

			await pool.execute(
				`UPDATE images
				 SET votes = votes + 1
				 WHERE id = ?`,
				[imageId]
			);
		}

		return { success: true };
	},

	follow: async ({ request, cookies }) => {
		const sessionId = cookies.get('session');
		const user = sessionId ? await validateSession(sessionId) : null;

		if (!user) {
			return fail(401, { error: 'Not logged in' });
		}

		const form = await request.formData();

		const authorId = Number(form.get('authorId'));

		if (authorId === user.id) {
			return fail(400, { error: 'Cannot follow yourself' });
		}

		const [existing] = await pool.execute(
			`SELECT 1
			 FROM follows
			 WHERE follower_id = ? AND following_id = ?`,
			[user.id, authorId]
		);

		if (existing.length > 0) {
			await pool.execute(
				`DELETE FROM follows
				 WHERE follower_id = ? AND following_id = ?`,
				[user.id, authorId]
			);
		} else {
			await pool.execute(
				`INSERT INTO follows (follower_id, following_id)
				 VALUES (?, ?)`,
				[user.id, authorId]
			);
		}

		return { success: true };
	},

	delete: async ({ request, cookies }) => {
		const sessionId = cookies.get('session');
		const user = sessionId ? await validateSession(sessionId) : null;

		if (!user) {
			return fail(401, { error: 'Not logged in' });
		}

		const form = await request.formData();
		const imageId = Number(form.get('imageId'));

		const [rows] = await pool.execute(
			`SELECT author_id
			 FROM images
			 WHERE id = ?`,
			[imageId]
		);

		if (!rows.length || rows[0].author_id !== user.id) {
			return fail(403, { error: 'Not allowed' });
		}

		await pool.execute(
			`DELETE FROM images
			 WHERE id = ?`,
			[imageId]
		);

		return { deleted: true };
	}
};