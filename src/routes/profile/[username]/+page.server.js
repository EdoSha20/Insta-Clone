import pool from '$lib/server/db';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { username } = params;

	// user holen
	const [users] = await pool.execute(
		'SELECT id, username, email, created_at FROM users WHERE username = ?',
		[username]
	);

	if (users.length === 0) {
		throw error(404, 'User not found');
	}

	const user = users[0];

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
		[user.id]
	);

	return {
		profileUser: user,
		images
	};
}