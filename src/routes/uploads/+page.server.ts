import { checkFormDataProps, checkUserAuth, readFileNamesWithMimeTypes } from '$lib';
import { getSessionFromCookies } from '$lib/sessions.js'
import { error, fail } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
    try {
        const session = getSessionFromCookies(cookies);
        if (!session) return undefined;
        
        return {
            username: session.username,
            fileNamesWithMimeTypes: await readFileNamesWithMimeTypes(session.username)
        }
    } catch (e) {
        if (e instanceof Error) {
            console.error(e);
            error(500, { message: e.message });
        }
    }
}

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const dataCheck = checkFormDataProps(formData, ['username', 'password']);
        if (!dataCheck.success) {
            fail(400, { message: dataCheck.message });
        }

        const { username, password } = Object.fromEntries(formData) as { username: string, password: string };
        const authCheck = checkUserAuth(username, password);
        if (!authCheck.success) {
            return fail(400, { message: authCheck.message });
        }

        return {
            username: authCheck.user!.name,
            fileNamesWithMimeTypes: await readFileNamesWithMimeTypes(authCheck.user!.name)
        };
    }
}
