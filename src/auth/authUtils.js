'use strict'

const JWT = require('jsonwebtoken')
const asyncHandle = require('../helpers/asyncHandle')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } =  require('../services/keyToken.service')

const HEADERS= {
    CLIENT_ID: 'x-client-id',
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = (payload, publicKey, privateKey) => {
    try {
        // accessToken
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '2 days'
        })

        // verify access token
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if(err) {
                console.log(`Error verify::${err}`)
            } else {
                console.log(`Decode verify::`, decode)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        return error
    }
}

const authentication = asyncHandle( async (req, res, next) => {
    /*
    1 - Check userId missing??
    2 - get access token
    3 - verify access token
    4 - check user in db?
    5 - check keystore with userId
    6 - return next()
     */

    const userId = req.headers[HEADERS.CLIENT_ID]
    if (! userId) {
        throw new AuthFailureError('Invalid Request')
    }

    const keyStore = await findByUserId(userId);
    if (! keyStore) {
        throw new NotFoundError('Not found Key store')
    }

    const accessToken =  req.headers[HEADERS.AUTHORIZATION];
    if (! accessToken) {
        throw new AuthFailureError('Invalid Request')
    }

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) {
            throw new AuthFailureError('Invalid User Id')
        }
        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret);
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}