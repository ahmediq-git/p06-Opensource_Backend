import {EncryptJWT} from 'jose';

export default async function sign(payload: any, key: string) {
    return await EncryptJWT(payload, key);
}
