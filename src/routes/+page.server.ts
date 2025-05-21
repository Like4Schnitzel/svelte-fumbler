import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { fail } from "@sveltejs/kit";

export const actions = {
    default: async ({ request }) => {
        try {
            const formData = Object.fromEntries(await request.formData());
            if (!formData.file) {
                return fail(400, { message: "Please provide a file." });
            }

            const { file } = formData as { file: File };
            if (!existsSync('./files')) {
                mkdirSync('./files');
            }
            writeFileSync(`./files/${file.name}`, Buffer.from(await file.arrayBuffer()));

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
