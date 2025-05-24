import { getSessionById, getSessionFromCookies } from '$lib/sessions';

export const load = async ({ cookies }) => {
    return getSessionFromCookies(cookies);
}
