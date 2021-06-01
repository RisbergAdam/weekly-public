export interface Ok<T> {
    isOk: true;
    unwrap: () => T;
}

export interface Fail {
    isOk: false;
    error: any;
    unwrap: () => never;
}

export type Result<T> = Ok<T> | Fail;

export function Fail(e: any): Fail {
    return {
        isOk: false,
        error: e,
        unwrap: () => { throw new Error("Error: unwrapped failure."); },
    };
}

export function Ok<T>(value: T): Ok<T> {
    return {
        isOk: true,
        unwrap: () => value,
    };
}
