import { JSONFilePreset } from "lowdb/node";
import type { User } from "./types";
import { sha256 } from "js-sha256";
import { join } from "path";

const defaultData: User[] = []

export const db = await JSONFilePreset("db.json", defaultData);
db.write();

export const fileDirRoot = join(import.meta.dirname, "..", "..", "files");

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
} {
    for (const prop of expectedProperties) {
        if (!formData.has(prop)) {
            return {
                success: false,
                message: `Please provide a ${prop}.`,
            };
        }
    }

    return {
        success: true,
    };
}
