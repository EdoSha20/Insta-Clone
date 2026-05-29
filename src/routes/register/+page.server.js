import { fail, redirect } from '@sveltejs/kit';

import pool from '$lib/server/db';

import {
    hashPassword,
    createSession
} from '$lib/server/auth';


export const actions = {

    register: async ({ request, cookies }) => {

        // Formulardaten holen
        const formData = await request.formData();

        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');


        // Validierung
        if (!username || !email || !password) {

            return fail(400, {
                error: 'Alle Felder sind erforderlich'
            });

        }


        let result;

        try {

            // Passwort hashen
            const hashedPassword = await hashPassword(password);


            // User speichern
            [result] = await pool.execute(
                `
                INSERT INTO users
                (username, email, password, role)
                VALUES (?, ?, ?, ?)
                `,
                [
                    username,
                    email,
                    hashedPassword,
                    'user'
                ]
            );

        } catch (error) {

            // Username oder Email existiert bereits
            if (error.code === 'ER_DUP_ENTRY') {

                return fail(400, {
                    error: 'Username oder Email existiert bereits'
                });

            }

            return fail(500, {
                error: 'Serverfehler'
            });

        }


        // Session erstellen
        const sessionId = await createSession(result.insertId);


        // Cookie setzen
        cookies.set('session', sessionId, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: false, // auf Vercel später true
            maxAge: 60 * 60 * 24 * 30 // 30 Tage
        });


        // Weiterleitung
        throw redirect(303, '/');

    }

};