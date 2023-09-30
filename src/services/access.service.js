'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')

const roleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // step1: check email exists?
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                return  {
                    code: 'xxxx',
                    message: 'Shop already register',
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [roleShop.SHOP]
            })
            if (newShop) {
                // crated private key, public key.
                /*
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
                */
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');
                console.log({ publicKey, privateKey}) // save collection KeyStore
                const publicKeyStr = await KeyTokenService.createToken({ userId: newShop._id, publicKey, privateKey})
                if (! publicKeyStr) {
                    return  {
                        code: 'xxxx',
                        message: 'Fail to create key store',
                    }
                }

                // create token
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                console.log(`Create token success`, tokens)
                console.log(getInfoData({ fields: ['_id', 'name', 'email'] , object: newShop}));
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({
                            fields: ['_id', 'name', 'email'],
                            object: newShop
                        }),
                        tokens
                    }
                }
            }
            return {
                code: 200,
                metadata: null
            }
        } catch (error) {
            console.log(error);
            return  {
                code: 'xxxx',
                message: error.message,
                status: false
            }
        }
    }
}

module.exports = AccessService