import { fail, redirect } from '@sveltejs/kit';
import pool from '$lib/server/db';
import { hashPassword, createSession } from '$lib/server/auth';

export async function load({ locals }) {
	if (locals.user) {
		throw redirect(303, `/profile/${locals.user.username}`);
	}
}

export const actions = {
	register: async ({ request, cookies }) => {
		const formData = await request.formData();

		const username = formData.get('username');
		const email = formData.get('email');
		const password = formData.get('password');

		if (!username || !email || !password) {
			return fail(400, {
				error: 'Alle Felder sind erforderlich'
			});
		}

		let result;

		try {
			const hashedPassword = await hashPassword(password);

			const [res] = await pool.execute(
				`
				INSERT INTO users
				(username, email, password, role)
				VALUES (?, ?, ?, ?)
				`,
				[username, email, hashedPassword, 'user']
			);

			result = res;
		} catch (err) {
			if (err?.code === 'ER_DUP_ENTRY') {
				return fail(400, {
					error: 'Username oder Email existiert bereits'
				});
			}

			return fail(500, {
				error: 'Serverfehler'
			});
		}

		const sessionId = await createSession(result.insertId);

		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 30
		});

		throw redirect(303, `/profile/${username}`);
	}
};