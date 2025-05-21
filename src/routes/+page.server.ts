import { sha256 } from 'js-sha256';
import { db } from '../lib/index.js';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { fail } from "@sveltejs/kit";

export const actions = {
    default: async ({ request }) => {
        try {
            const formData = Object.fromEntries(await request.formData());
            if (!formData.username) {
                return fail(400, { message: "Please provide a username." });
            }

            if (!formData.password) {
                return fail(400, { message: "Please provide a password." });
            }

            if (!formData.file) {
                return fail(400, { message: "Please provide a file." });
            }

            const { username, password, file } = formData as { username: string, password: string, file: File };
            const user = db.data.find(u => u.name === username);
            if (!user) {
                return fail(400, { message: `User ${username} does not exist.` });
            }

            if (user.password !== sha256(password)) {
                return fail(400, { message: "Incorrect password." });
            }

            if (!existsSync('./files')) {
                mkdirSync('./files');
            }
            if (!existsSync(`./files/${user.name}`)) {
                mkdirSync(`./files/${user.name}`);
            }
            writeFileSync(`./files/${user.name}/${file.name}`, Buffer.from(await file.arrayBuffer()));

            return {
                success: true
            };
        } catch (e) {
            console.error(e);
            let errorMessage = e instanceof Error ? e.message : null;
            return fail(500, { message: errorMessage });
        }
    }
}
