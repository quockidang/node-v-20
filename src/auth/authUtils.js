'use strict'

const JWT = require('jsonwebtoken')

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
                console.log(`Decode verify::${decode}`)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        return error
    }
}

module.exports = {
    createTokenPair
}