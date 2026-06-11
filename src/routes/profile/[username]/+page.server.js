import pool from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth.js';

export async function load({ params, cookies }) {
	const { username } = params;

	// SESSION CHECK (WICHTIG FÜR LOGIN/LOGOUT UI)
	const sessionId = cookies.get('session');
	const user = sessionId ? await validateSession(sessionId) : null;

	// user holen (Profil Owner)
	const [users] = await pool.execute(
		'SELECT id, username, email, created_at FROM users WHERE username = ?',
		[username]
	);

	if (users.length === 0) {
		throw error(404, 'User not found');
	}

	const profileUser = users[0];

	// images vom user holen
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