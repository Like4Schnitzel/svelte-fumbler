import { JSONFilePreset } from "lowdb/node";
import type { User } from "./types";

const defaultData: User[] = []

export const db = await JSONFilePreset("db.json", defaultData);
db.write();
