import { checkFormDataProps, checkUserAuth, fileDirRoot } from '../lib/index.js';
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

            if (!existsSync(fileDirRoot)) {
                mkdirSync(fileDirRoot);
            }
            if (!existsSync(`${fileDirRoot}/${username}`)) {
                mkdirSync(`${fileDirRoot}/${username}`);
            }

            const filename = file.name.toLowerCase().replace(/[^a-zA-Z0-9.]/g, '_');
            if (existsSync(`${fileDirRoot}/${username}/${filename}`)) {
                return fail(400, { message: "File already exists." });
            }
            writeFileSync(`${fileDirRoot}/${username}/${filename}`, Buffer.from(await file.arrayBuffer()));

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
