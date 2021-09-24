import crypto from 'crypto';

function generateID() {
    return crypto.randomBytes(8).toString('hex')
}

export { generateID };
