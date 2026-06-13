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



// =====================
// ACTIONS SAVE / UNSAVE
// =====================

export const actions = {

	save: async ({ request, cookies }) => {

		const sessionId = cookies.get('session');
		const user = sessionId ? await validateSession(sessionId) : null;


		if (!user) {
			return fail(401, {
				error: 'Not logged in'
			});
		}


		const form = await request.formData();
		const imageId = Number(form.get('imageId'));


		await pool.execute(
			`
			INSERT IGNORE INTO saved_posts (user_id, image_id)
			VALUES (?, ?)
			`,
			[user.id, imageId]
		);


		return {
			saved: true
		};
	},



	unsave: async ({ request, cookies }) => {

		const sessionId = cookies.get('session');
		const user = sessionId ? await validateSession(sessionId) : null;


		if (!user) {
			return fail(401, {
				error: 'Not logged in'
			});
		}


		const form = await request.formData();
		const imageId = Number(form.get('imageId'));


		await pool.execute(
			`
			DELETE FROM saved_posts
			WHERE user_id = ? AND image_id = ?
			`,
			[user.id, imageId]
		);


		return {
			saved: false
		};
	}

};