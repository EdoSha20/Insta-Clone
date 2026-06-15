import pool from '$lib/server/db';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { username } = params;

	// USER holen
	const [users] = await pool.execute(
		`SELECT id, username, avatar FROM users WHERE username = ?`,
		[username]
	);

	if (!users.length) throw error(404, 'User not found');

	const profileUser = users[0];

	// FOLLOWING LISTE
	const [following] = await pool.execute(
		`
		SELECT 
			u.id,
			u.username,
			u.avatar
		FROM follows f
		JOIN users u ON u.id = f.following_id
		WHERE f.follower_id = ?
		ORDER BY u.username ASC
		`,
		[profileUser.id]
	);

	return {
		profileUser,
		following: following || []
	};
}