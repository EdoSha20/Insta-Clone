import { redirect } from '@sveltejs/kit';
import { invalidateSession } from '$lib/server/auth';

export const actions = {
	logout: async ({ cookies }) => {

		const sessionId = cookies.get('session');

		// Session aus Datenbank löschen
		if (sessionId) {
			await invalidateSession(sessionId);
		}

		// Cookie löschen
		cookies.delete('session', {
			path: '/'
		});

		// Zur Startseite weiterleiten
		throw redirect(303, '/');
	}
}; 