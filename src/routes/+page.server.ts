import { checkFormDataProps, checkUserAuth } from '../lib/index.js';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { fail } from "@sveltejs/kit";

export const actions = {
    default: async ({ request }) => {
        try {
            const formData = await request.formData();
            const dataCheck = checkFormDataProps(formData, ["username", "password", "file"]);
            if (!dataCheck.success) {
                return fail(400, { message: dataCheck.message });
            }

            const { username, password, file } = Object.fromEntries(formData) as { username: string, password: string, file: File };
            const authcheck = checkUserAuth(username, password);
            if (!authcheck.success) {
                return fail(400, { message: authcheck.message });
            }

            if (!existsSync('./files')) {
                mkdirSync('./files');
            }
            if (!existsSync(`./files/${username}`)) {
                mkdirSync(`./files/${username}`);
            }

            const filename = file.name.toLowerCase().replace(/[^a-zA-Z0-9.]/g, '_');
            if (existsSync(`./files/${username}/${filename}`)) {
                return fail(400, { message: "File already exists." });
            }
            writeFileSync(`./files/${username}/${filename}`, Buffer.from(await file.arrayBuffer()));

            return {
                success: true,
                path: `/${username}/${filename}`,
            };
        } catch (e) {
            console.error(e);
            let errorMessage = e instanceof Error ? e.message : null;
            return fail(500, { message: errorMessage });
        }
    }
}
