import { existsSync } from "fs";
import { readFile } from "fs/promises";
import mime from "mime";
import { fileTypeFromFile } from "file-type";
import type { RequestHandler } from "./$types";
import { fileDirRoot } from "$lib";

export const GET: RequestHandler = async ({ params }) => {
    const { username, filename } = params;

    const path = `${fileDirRoot}/${username}/${filename}`;
    if (existsSync(path)) {
        const mimeTypeReader = fileTypeFromFile(path);
        const fileReader = readFile(path);
        let mimeType = (await mimeTypeReader)?.mime;
        // file extension fallback
        if (!mimeType) {
            mimeType = mime.getType(filename) || "application/octet-stream";
        }
        const file = await fileReader;

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
