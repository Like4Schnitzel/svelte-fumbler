import { db } from "$lib";
import { deleteSession, getSessionById, getSessionByUsername } from "$lib/sessions";
import { error, fail, isRedirect, redirect } from "@sveltejs/kit";
import { sha256 } from "js-sha256";

export async function load({ params }) {
    const { sessionId } = params;

    const session = getSessionById(sessionId);
    if (!session) {
        error(404, { message: "Session probably expired. Ask an admin for a new one." });
    }

    return session;
}

export const actions = {
    default: async ({ request, params }) => {
        try {
            const formDataReader = request.formData();
            const { sessionId } = params;

            const session = getSessionById(sessionId);
            if (!session) {
                return fail(404, { message: "Session probably expired. Ask an admin for a new one." });
            }
            const { username } = session;
            if (db.data.find(user => user.name === username)) {
                return fail(400, { message: "User already exists." });
            }

            const formData = await formDataReader;
            if (!formData.has("password")) {
                return fail(400, { message: "Please provide a password." });
            }
            if (!formData.has("password-repeat")) {
                return fail(400, { message: "Please repeat the password to confirm." });
            }

            const { password } = Object.fromEntries(formData) as { password: string };
            const passwordRepeat = formData.get("password-repeat") as string;
            if (password !== passwordRepeat) {
                return fail(400, { message: "Passwords must match." });
            }

            db.update(users => users.push({
                name: session.username,
                password: sha256(password),
                admin: false,
            }));

            deleteSession(sessionId);
            redirect(303, "/");
        } catch (e) {
            if (isRedirect(e)) {
                throw e;
            }

            console.error(e);
            let errorMessage = e instanceof Error ? e.message : null;
            return fail(500, { message: errorMessage });
        }
    }
}
