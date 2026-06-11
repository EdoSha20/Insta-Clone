import pool from '$lib/server/db.js';
import { validateSession } from '$lib/server/auth.js';

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
			u.username AS author
		FROM images i
		INNER JOIN users u ON i.author_id = u.id
		ORDER BY i.votes DESC, i.created_at DESC
		LIMIT 25
	`);

	return {
		images,
		user
	};
}