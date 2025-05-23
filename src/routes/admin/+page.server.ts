import { checkFormDataProps, checkUserAuth, db } from "$lib";
import { addSession, createSession, getSessionByUsername } from "$lib/sessions.js";
import { fail } from "@sveltejs/kit";

export const actions = {
    default: async ({ request }) => {
        try {
            const formData = await request.formData();
            const dataCheck = checkFormDataProps(formData, ["username", "password", "new-username"]);
            if (!dataCheck.success) {
                // special case for new-username
                if (dataCheck.message === "Please provide a new-username.") {
                    return fail(400, { message: "Please provide a username for the new user." });
                }
                return fail(400, { message: dataCheck.message });
            }

            const { username, password } = Object.fromEntries(formData) as { username: string, password: string };
            const newUsername = formData.get("new-username") as string;

            if (db.data.find(user => user.name === newUsername)) {
                return fail(400, { message: "User already exists." });
            }
            
            const authCheck = checkUserAuth(username, password);
            if (!authCheck.success) {
                return fail(400, { message: authCheck.message });
            }

            if (!authCheck.user?.admin) {
                return fail(403, { message: "Only admin accounts may create new users." });
            }

            const signUpSession = createSession(newUsername, 1000 * 60 * 10, 'signup'); // 10 minute session
            if (!addSession(signUpSession)) {
                return fail(400, { message: `User already has a session: ${getSessionByUsername(newUsername, 'signup')?.sessionId}.` });
            }

            return {
                success: true,
                sessionId: signUpSession.sessionId,
                username: signUpSession.username,
            };
        } catch (e) {
            console.error(e);
            let errorMessage = e instanceof Error ? e.message : null;
            return fail(500, { message: errorMessage });
        }
    }
}
