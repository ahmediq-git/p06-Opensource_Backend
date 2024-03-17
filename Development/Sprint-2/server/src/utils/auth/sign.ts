import jwt from 'jsonwebtoken';

export default async function sign(payload: any, key: string) {
    return jwt.sign(payload, key);
}
