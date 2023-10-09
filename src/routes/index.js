'use strict'

const express = require('express')
const router = express.Router()
const { apiKey, permission } = require('../auth/checkAuth')

// check Apikey
//router.use(apiKey)
// check permission
//router.use(permission('0000'))

router.use('/api/v1', require('./access'))
router.use('/api/v1/products', require('./product'))
router.use ('/api/v1/comments', require('./comment'))
module.exports = router;