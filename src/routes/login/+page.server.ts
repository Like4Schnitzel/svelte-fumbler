import { checkFormDataProps, checkUserAuth } from "$lib";
import { addSession, createSession, getSessionByUsername } from "$lib/sessions";
import type { Session } from "$lib/types.js";
import { fail, isRedirect, redirect } from "@sveltejs/kit";

const month = 1000 * 60 * 60 * 24 * 30;

export const actions = {
    default: async ({ request, cookies }) => {
        try {
            const formData = await request.formData();
            const dataCheck = checkFormDataProps(formData, ["username", "password", "time"]);
            if (!dataCheck.success) {
                return fail(400, { message: dataCheck.message });
            }

            const { username, password } = Object.fromEntries(formData) as { username: string, password: string };
            const time = parseInt(formData.get("time") as string);
            if (isNaN(time) || time < 0 || time > month) {
                return fail(400, { message: "Invalid time value" });
            }
            const authcheck = checkUserAuth(username, password);
            if (!authcheck.success) {
                return fail(400, { message: authcheck.message });
            }

            let session: Session | undefined = getSessionByUsername(username, 'login') || createSession(username, time, 'login');
            addSession(session); // if the session already exists this just does nothing
            cookies.set("session-id", session.sessionId, {
                sameSite: "strict",
                maxAge: time / 1000, // convert to seconds from now
                path: "/",
            });

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