import { checkFormDataProps, checkUserAuth, fileDirRoot } from "$lib";
import { getSessionFromCookies } from "$lib/sessions";
import { fail, redirect } from "@sveltejs/kit";
import { existsSync, unlinkSync } from "fs";

export const load = async () => {
    redirect(303, '/');
}

export const actions = {
    default: async ({ params, request, cookies }) => {
        const { username, filename } = params;

        const path = `${fileDirRoot}/${username}/${filename}`;
        if (existsSync(path)) {
            const session = getSessionFromCookies(cookies);
            let authenticated: boolean;
            if (session?.username === username) {
                authenticated = true;
            } else {
                const formData = await request.formData();
                const dataCheck = checkFormDataProps(formData, ['password']);
                if (!dataCheck.success) {
                    return fail(400, { message: dataCheck.message });
                }

                const { password } = Object.fromEntries(formData) as { password: string };
                const authCheck = checkUserAuth(username, password);
                if (!authCheck.success) {
                    return fail(403, { message: authCheck.message });
                }
                authenticated = true;
            }

            if (authenticated) {
                unlinkSync(path);
            } else {
                return new Response("Authentication failed", {
                    status: 403,
                    headers: {
                        "Content-Type": "text/plain",
                    },
                });
            }

            return redirect(303, `/uploads`);
        } else {
            return new Response("File not found", {
                status: 404,
                headers: {
                    "Content-Type": "text/plain",
                },
            });
        }
    }
};
