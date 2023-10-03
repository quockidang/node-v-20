'use strict'

const express = require('express')
const router = express.Router()
const { asyncHandle } = require('../../auth/checkAuth')
const accessController = require('../../controllers/access.controller')
const { authentication } = require('../../auth/authUtils')


// signUp
router.post('/shop/signup', asyncHandle(accessController.signUp))
// signIn
router.post('/shop/login', asyncHandle(accessController.login))

// authentication
router.use(authentication)

// logout
router.post('/shop/logout', asyncHandle(accessController.logout))
router.post('/shop/refresh-token', asyncHandle(accessController.handleRefreshToken))
module.exports = router;