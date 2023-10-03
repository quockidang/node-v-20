
require('dotenv').config();
const crypto = require('node:crypto')
const app = require('./src/app');
const PORT = process.env.PORT || 3055;
const { createTokenPair } = require("./src/auth/authUtils")

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
})

console.log(publicKey, privateKey, typeof privateKey, typeof publicKey)

const server = app.listen(PORT, () =>{
    console.log(`WSV start with port ${PORT}`)
});

process.on('SIGN', () => {
    server.close(() => `Exit server express`);
})