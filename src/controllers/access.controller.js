'use strict'

const AccessService = require("../services/access.service")
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class AccessController {
    handleRefreshToken = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get refresh token Success',
            metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
        }).send(res)
    }

    logout = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Logout Success',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    login = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Login Success',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    signUp = async (req, res, next) => {
        return new CREATED({
            message: 'Registed OK',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
}

module.exports = new AccessController();