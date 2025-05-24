import { isRedirect, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ cookies, request }) => {
        try {
            const session = cookies.get('session-id');
            if (!session) {
                return new Response("No session found", { status: 400 });
            }

            // Delete the session
            cookies.delete('session-id', { path: '/' });

            redirect(303, request.headers.get('origin') || '/');
        } catch (e) {
            if (isRedirect(e)) {
                throw e;
            }
            console.error(e);
            return new Response("Internal Server Error", { status: 500 });
        }
    }
};
