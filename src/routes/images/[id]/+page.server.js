import db from '$lib/server/db.js';
import { error } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth.js';

export async function load({ params, cookies }) {
	const id = Number(params.id);

	if (!id) {
		throw error(400, 'Invalid image id');
	}

	const sessionId = cookies.get('session');
	const user = sessionId ? await validateSession(sessionId) : null;

	// IMAGE
	const [images] = await db.execute(
		`
		SELECT i.*, u.username AS author
		FROM images i
		JOIN users u ON i.author_id = u.id
		WHERE i.id = ?
		`,
		[id]
	);

	if (!images.length) {
		throw error(404, 'Image not found');
	}

	// COMMENTS
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

	// VOTE CHECK (SAFE)
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