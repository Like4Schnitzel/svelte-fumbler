import { JSONFilePreset } from "lowdb/node";
import type { User } from "./types";
import { sha256 } from "js-sha256";
import { join } from "path";
import mime from "mime";
import { fileTypeFromFile } from "file-type";
import { readFile, readdir } from "fs/promises";

const defaultData: User[] = []

export const fileDirRoot = join(import.meta.dirname, "..", "..", "files");
export const dbPath = join(import.meta.dirname, "..", "..", "db.json");

export const db = await JSONFilePreset(dbPath, defaultData);
db.write();

export function checkUserAuth(username: string, password: string): {
    success: boolean;
    message?: string;
    user?: User;
} {
    const user = db.data.find((u) => u.name === username);
    if (!user) {
        return {
            success: false,
            message: `User ${username} does not exist.`,
        };
    }
    if (user.password !== sha256(password)) {
        return {
            success: false,
            message: "Incorrect password.",
        };
    }

    return {
        success: true,
        user
    };
}

export function checkFormDataProps(formData: FormData, expectedProperties: string[]): {
    success: boolean;
    message?: string;
    failedProp?: string;
} {
    for (const prop of expectedProperties) {
        if (!formData.has(prop)) {
            return {
                success: false,
                message: `Please provide a ${prop}.`,
                failedProp: prop,
            };
        }
    }

    return {
        success: true,
    };
}

export async function readFileWithMimeType(path: string) {
    const mimeTypeReader = fileTypeFromFile(path);
    const fileReader = readFile(path);
    let mimeType = (await mimeTypeReader)?.mime;
    // file extension fallback
    if (!mimeType) {
        mimeType = mime.getType(path) || "application/octet-stream";
    }
    const file = await fileReader;
    return {
        file,
        mimeType,
    };
}

export async function readMimeType(path: string) {
    const mimeTypeReader = fileTypeFromFile(path);
    let mimeType = (await mimeTypeReader)?.mime;
    // file extension fallback
    if (!mimeType) {
        mimeType = mime.getType(path) || "application/octet-stream";
    }
    return mimeType
}

export async function readFileNamesWithMimeTypes(username: string) {
    const fileNames = await readdir(`${fileDirRoot}/${username}`);
    const mimeTypeReaders = fileNames.map(fn => readMimeType(`${fileDirRoot}/${username}/${fn}`));
    const fileNamesWithMimeTypes = [];
    for (let i = 0; i < mimeTypeReaders.length; i++) {
        fileNamesWithMimeTypes.push({
            fileName: fileNames[i],
            mimeType: await mimeTypeReaders[i]
        });
    }

    return fileNamesWithMimeTypes
}
