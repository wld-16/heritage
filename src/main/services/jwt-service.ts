export function parseJwt (token: string): any {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export default {
    parseJwt
}