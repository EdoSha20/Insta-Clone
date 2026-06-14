import db from '$lib/server/db.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth.js';

export async function load({ params, cookies }) {
	const id = Number(params.id);

	if (!id) throw error(400, 'Invalid image id');

	const sessionId = cookies.get('session');
	const user = sessionId ? await validateSession(sessionId) : null;

	if (!user) {
		throw redirect(303, '/login');
	}

	const [images] = await db.execute(
		`
		SELECT i.*, u.username AS author
		FROM images i
		JOIN users u ON i.author_id = u.id
		WHERE i.id = ?
		`,
		[id]
	);

	if (!images.length) throw error(404, 'Image not found');

	const [comments] = await db.execute(
		`
		SELECT c.*, u.username
		FROM comments c
		JOIN users u ON c.user_id = u.id
		WHERE c.images_id = ?
		ORDER BY c.created_at ASC
		`,
		[id]
	);

	let hasVoted = false;

	if (user?.id) {
		const [votes] = await db.execute(
			`
			SELECT 1
			FROM image_votes
			WHERE user_id = ? AND image_id = ?
			`,
			[user.id, id]
		);

		hasVoted = votes.length > 0;
	}

	return {
		image: images[0],
		comments,
		user,
		hasVoted
	};
}

export const actions = {
	comment: async ({ request, params, cookies }) => {
		const sessionId = cookies.get('session');
		const user = sessionId ? await validateSession(sessionId) : null;

		if (!user) {
			throw error(401, 'Not logged in');
		}

		const formData = await request.formData();
		const text = formData.get('text');

		if (!text || text.trim().length === 0) {
			return fail(400, {
				error: 'Comment cannot be empty'
			});
		}

		await db.execute(
			`
			INSERT INTO comments (user_id, images_id, text)
			VALUES (?, ?, ?)
			`,
			[user.id, Number(params.id), text]
		);

		return { success: true };
	},

	vote: async ({ params, cookies }) => {
		const sessionId = cookies.get('session');
		const user = sessionId ? await validateSession(sessionId) : null;

		if (!user) {
			throw error(401, 'Not logged in');
		}

		const imageId = Number(params.id);

		const [existing] = await db.execute(
			`
			SELECT 1 FROM image_votes
			WHERE user_id = ? AND image_id = ?
			`,
			[user.id, imageId]
		);

		if (existing.length > 0) {
			return fail(400, { error: 'Already voted' });
		}

		await db.execute(
			`
			INSERT INTO image_votes (user_id, image_id)
			VALUES (?, ?)
			`,
			[user.id, imageId]
		);

		await db.execute(
			`
			UPDATE images
			SET votes = votes + 1
			WHERE id = ?
			`,
			[imageId]
		);

		return { success: true };
	},

	edit: async ({ request, params, cookies }) => {
		const sessionId = cookies.get('session');
		const user = sessionId ? await validateSession(sessionId) : null;

		if (!user) {
			throw error(401, 'Not logged in');
		}

		const imageId = Number(params.id);

		const formData = await request.formData();
		const description = formData.get('description');

		if (!description || description.trim().length === 0) {
			return fail(400, {
				error: 'Description cannot be empty'
			});
		}

		const [image] = await db.execute(
			`SELECT author_id FROM images WHERE id = ?`,
			[imageId]
		);

		if (!image.length) {
			throw error(404, 'Image not found');
		}

		if (image[0].author_id !== user.id) {
			throw error(403, 'Not allowed');
		}

		await db.execute(
			`
			UPDATE images
			SET description = ?
			WHERE id = ?
			`,
			[description, imageId]
		);

		return { success: true };
	},
};