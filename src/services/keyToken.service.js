'use stricrt'

const keytokenModel = require("../models/keytoken.model")

class KeyTokenService {
    static createToken = async ({ userId, publicKey, privateKey}) => {
        try {
            const tokens = await keytokenModel.create({
                user: userId, publicKey, privateKey
            })
            console.log(tokens);
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService;
