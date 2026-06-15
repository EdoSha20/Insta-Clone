import db from '$lib/server/db.js';
import { redirect } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth.js';

export async function load({ cookies }) {
	const sessionId = cookies.get('session');
	const user = sessionId ? await validateSession(sessionId) : null;

	if (!user) {
		throw redirect(303, '/login');
	}

	const [rows] = await db.execute(
		`
		SELECT i.*
		FROM images i
		JOIN saved_posts s ON s.image_id = i.id
		WHERE s.user_id = ?
		ORDER BY s.created_at DESC
		`,
		[user.id]
	);

	return {
		posts: rows,
		user
	};
}