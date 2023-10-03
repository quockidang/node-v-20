'use stricrt'

const keytokenModel = require("../models/keytoken.model")
const { Types } =  require('mongoose')

class KeyTokenService {
    static deleteKeyByUserId = async ( userId ) => {
        return await keytokenModel.deleteOne({ user: new Types.ObjectId(userId) })
    }

    static findByRefreshToken = async ( refreshToken ) => {
        return await keytokenModel.findOne({ refreshToken: refreshToken })
    }

    static findByRefreshTokenUsed = async ( refreshToken ) => {
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }
    static createToken = async ({ refreshToken, userId, publicKey, privateKey}) => {
        try {
            /*
            lv 0
            const tokens = await keytokenModel.create({
                user: userId, publicKey, privateKey
            })
            console.log(tokens);
            return tokens ? tokens.publicKey : null;
            */

           // lv xxx
           const filter = {
                user: userId
            }, update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken
            }, options = {
                upsert: true,
                new: true
            }

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        console.log({ userId })
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: new Types.ObjectId(id) })
    }
}

module.exports = KeyTokenService;
