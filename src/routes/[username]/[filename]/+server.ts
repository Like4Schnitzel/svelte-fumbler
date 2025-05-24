import { existsSync } from "fs";
import type { RequestHandler } from "./$types";
import { fileDirRoot, readFileWithMimeType } from "$lib";

export const GET: RequestHandler = async ({ params }) => {
    const { username, filename } = params;

    const path = `${fileDirRoot}/${username}/${filename}`;
    if (existsSync(path)) {
        const { file, mimeType } = await readFileWithMimeType(path);

        return new Response(file, {
            status: 200,
            headers: {
                "Content-Type": mimeType,
            },
        });
    } else {
        return new Response("File not found", {
            status: 404,
            headers: {
                "Content-Type": "text/plain",
            },
        });
    }
}
