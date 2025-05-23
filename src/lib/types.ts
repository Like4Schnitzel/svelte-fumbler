export type User = {
    name: string,
    password: string,
    admin: boolean,
}

export type SessionTypes = 'login' | 'signup';

export type Session = {
    sessionId: string,
    username: string,
    expires: number, // timestamp in ms, compare to Date.now()
    purpose: SessionTypes
}
