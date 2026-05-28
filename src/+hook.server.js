import { validateSession } from '$lib/server/auth';

export async function handle({ event, resolve }) {

    // Session-Cookie holen
    const sessionId = event.cookies.get('session');

    // User in locals speichern
    event.locals.user = sessionId
        ? await validateSession(sessionId)
        : null;

    // Anfrage weitergeben
    return resolve(event);
}