export type Id = number;

export type Reference= Id;

export interface IdMap<T> {[_: string]: T; }

export function IdMapValues<T>(map: IdMap<T>): T[] {
    return Object.values(map);
}

export function ToMap<T extends { id: Id }>(list: T[]): IdMap<T> {
    const map: IdMap<T> = {};
    list.forEach((t) => map[t.id] = t);
    return map;
}
