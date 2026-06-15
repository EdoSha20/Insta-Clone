import pool from '$lib/server/db.js';

export async function load({ url }) {
	const q = url.searchParams.get('q') || '';

	let users = [];

	if (q.trim()) {
		const [rows] = await pool.execute(
			`
			SELECT id, username, avatar
			FROM users
			WHERE username LIKE ?
			ORDER BY username ASC
			LIMIT 20
			`,
			[`%${q}%`]
		);

		users = rows;
	}

	return {
		q,
		users
	};
}