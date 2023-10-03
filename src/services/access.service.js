'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const {
    BadRequestError, 
    ConflictRequestError, 
    AuthFailureError,
    ForbiddenError
} = require('../core/error.response')
const { findByEmail } = require('./shop.service')

const roleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {

    /*
        check token used ?
    */
    static handleRefreshToken = async (refreshToken) => {
        // check xem token nay da dc su dung chua
        const foundToken = await KeyTokenService.findByRefreshTokenUsed( refreshToken )
        if (foundToken) {
            // xem no la ai
            const { userId, email } = await verifyJWT( refreshToken, foundToken.privateKey )
            console.log("[1]-------", { userId, email })
            // xoa
            await KeyTokenService.deleteKeyByUserId( userId ) 
            throw new ForbiddenError('Something went wrong! please relogin')
        }

        // NO, qua ngon
        const holderToken = await KeyTokenService.findByRefreshToken( refreshToken )
        if (! holderToken) {
            throw new AuthFailureError("Shop not register 1")
        }

        const { userId, email } = await verifyJWT( refreshToken, holderToken.privateKey )
        console.log("[2]-------", { userId, email })
        const holderShop = await findByEmail({ email })
        if (! holderShop) {
            throw new AuthFailureError("Shop not register 2")
        }

        // create 1 cap token moi
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

        // update keytoke with new token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // refreshToken da dc su dung de lay token moi
            }
        })

        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: holderShop
            }),
            tokens
        }

    }
    static logout = async (keyStore) => {
        return await KeyTokenService.removeKeyById( keyStore._id )
    }
    /**
     1 - check email in database
     2 - match password
     3 - create access token and refresh token in database
     4 - genarete tokens
     5 - get data return login
     */
    static login = async ({ email, password }) => {
        const foundShop = await findByEmail({ email })
        if (! foundShop ) {
            throw new BadRequestError('Error: Shop not registed');
        }
        console.log(foundShop)
        const match = await bcrypt.compare(password, foundShop.password)
        if (! match) {
            throw new AuthFailureError('Authentication error')
        }

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const {_id: userId} = foundShop
        const tokens = createTokenPair({ userId, email }, publicKey, privateKey)

        await KeyTokenService.createToken({ refreshToken: tokens.refreshToken, userId, publicKey, privateKey})
        return {
            shop: getInfoData({
                fields: ['_id', 'name', 'email'],
                object: foundShop
            }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        try {
            // step1: check email exists?
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                throw new BadRequestError('Error: Shop already register')
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
                const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)

                const publicKeyStr = await KeyTokenService.createToken({ refreshToken: tokens.refreshToken, userId: newShop._id, publicKey, privateKey})
                if (! publicKeyStr) {
                    return  {
                        code: 'xxxx',
                        message: 'Fail to create key store',
                    }
                }
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