import { Id } from "../domain/Types";

export const undefinedId: Id | undefined = undefined;
export const undefinedString: string | undefined = undefined;
export const undefinedNumber: number | undefined = undefined;

export function typedUndefined<T>(): T | undefined { return undefined; }
