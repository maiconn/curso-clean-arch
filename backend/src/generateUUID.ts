import * as crypto from 'node:crypto';

export default function generateUUID () {
    return crypto.randomUUID();
}
