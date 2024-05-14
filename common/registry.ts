export class RegistryClass {
    id: string
}

export function makeRegistry<T>(map: T){
    return Object.fromEntries(Object.entries(map).map(([id, value]) => [id, Object.assign(value, {id})])) as {
        [K in keyof typeof map]: T[K] & {id: K};
    }
}

export function makeTypedRegistry<T, V extends string>(type: V, map: T){
    return Object.fromEntries(Object.entries(map).map(([id, value]) => [id, Object.assign(value, {id, type})])) as {
        [K in keyof typeof map]: T[K] & {id: K, type: V};
    }
}