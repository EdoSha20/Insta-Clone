import { validateSession } from '$lib/server/auth.js';

export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get('session');

	if (sessionId) {
		const user = await validateSession(sessionId);

		if (!user) {
			event.cookies.delete('session', { path: '/' });
			event.locals.user = null;
		} else {
			event.locals.user = user;
		}
	} else {
		event.locals.user = null;
	}

	return resolve(event);
}