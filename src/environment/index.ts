export function value(key: string, def: string) {
    return process.env[key] || def
}
