import { fail, redirect } from '@sveltejs/kit';

import pool from '$lib/server/db';
import { verifyPassword, createSession } from '$lib/server/auth';

export async function load({ locals }) {
	if (locals.user) {
		throw redirect(303, `/profile/${locals.user.username}`);
	}
}

export const actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();

		const username = formData.get('username');
		const password = formData.get('password');

		if (!username || !password) {
			return fail(400, {
				error: 'Username und Passwort sind erforderlich'
			});
		}

		const [rows] = await pool.execute(
			`
			SELECT id, username, password
			FROM users
			WHERE username = ?
			`,
			[username]
		);

		const user = rows?.[0];

		if (!user) {
			return fail(401, {
				error: 'Falscher Username oder Passwort'
			});
		}

		const validPassword = await verifyPassword(
			password,
			user.password
		);

		if (!validPassword) {
			return fail(401, {
				error: 'Falscher Username oder Passwort'
			});
		}

		const sessionId = await createSession(user.id);

		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			
		});

		throw redirect(303, `/profile/${user.username}`);
	}
};