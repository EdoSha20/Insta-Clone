import { fail, redirect } from '@sveltejs/kit';

import pool from '$lib/server/db';

import {
	verifyPassword,
	createSession
} from '$lib/server/auth';


export const actions = {

	login: async ({ request, cookies }) => {

		// Formulardaten holen
		const formData = await request.formData();

		const username = formData.get('username');
		const password = formData.get('password');


		// Validierung
		if (!username || !password) {

			return fail(400, {
				error: 'Username und Passwort sind erforderlich'
			});

		}


		// User suchen
		const [rows] = await pool.execute(
			`
			SELECT * FROM users
			WHERE username = ?
			`,
			[username]
		);


		// User nicht gefunden
		if (rows.length === 0) {

			return fail(401, {
				error: 'Falscher Username oder Passwort'
			});

		}


		const user = rows[0];


		// Passwort überprüfen
		const validPassword = await verifyPassword(
			password,
			user.password
		);


		// Passwort falsch
		if (!validPassword) {

			return fail(401, {
				error: 'Falscher Username oder Passwort'
			});

		}


		// Session erstellen
		const sessionId = await createSession(user.id);


		// Cookie setzen
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false, // später auf Vercel true
			maxAge: 60 * 60 * 24 * 30 // 30 Tage
		});


		// Weiterleitung
		throw redirect(303, '/');

	}

};