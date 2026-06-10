import pool from '$lib/server/db.js';

export async function load({ locals }) {

	const [images] = await pool.execute(`
		SELECT
			i.id,
			i.image,
			i.description,
			i.votes,
			i.created_at,
			u.username AS author
		FROM images i
		INNER JOIN users u
			ON i.author_id = u.id
		ORDER BY i.votes DESC, i.created_at DESC
		LIMIT 25
	`);

	return {
		images,
		user: locals.user
	};
}