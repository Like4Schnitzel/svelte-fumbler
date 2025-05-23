import type { Session, SessionTypes } from "./types";

// stays in server memory until restart
const sessions: Session[] = []

export function createSession(userId: string, ttl: number, type: SessionTypes): Session {
    const sessionId = crypto.randomUUID();
    const expires = Date.now() + ttl;
    const session: Session = {
        sessionId,
        username: userId,
        expires,
        purpose: type
    }
    return session;
}

export function addSession(session: Session): boolean {
    if (sessions.find(s => s.username === session.username)) {
        return false; // session already exists
    }
    sessions.push(session);
    return true;
}

export function getSessionByUsername(username: string, type: SessionTypes): Session | undefined {
    const session = sessions.find(s => s.username === username && s.purpose === type);
    if (!session) {
        return undefined;
    }
    if (session.expires < Date.now()) {
        // remove expired session
        sessions.splice(sessions.indexOf(session), 1);
        return undefined;
    }
    return session;
}

export function getSessionById(sessionId: string): Session | undefined {
    const session = sessions.find(s => s.sessionId === sessionId);
    if (!session) {
        return undefined;
    }
    if (session.expires < Date.now()) {
        // remove expired session
        sessions.splice(sessions.indexOf(session), 1);
        return undefined;
    }
    return session;
}

export function deleteSession(sessionId: string): boolean {
    const session = sessions.find(s => s.sessionId === sessionId);
    if (!session) {
        return false;
    }
    sessions.splice(sessions.indexOf(session), 1);
    return true;
}
