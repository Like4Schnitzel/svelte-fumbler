import { existsSync, readFileSync } from "fs";
import { fileTypeFromFile } from "file-type";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
    const { username, filename } = params;

    const path = `./files/${username}/${filename}`;
    if (existsSync(path)) {
        const mimeTypeReader = fileTypeFromFile(path);
        const file = readFileSync(path);
        const mimeType = (await mimeTypeReader)?.mime;

        return new Response(file, {
            status: 200,
            headers: {
                "Content-Type": mimeType || "application/octet-stream",
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
