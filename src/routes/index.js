'use strict'

const express = require('express')
const router = express.Router()
const { apiKey, permission } = require('../auth/checkAuth')

// check Apikey
router.use(apiKey)
// check permission
router.use(permission('0000'))

router.use('/api/v1', require('./access'))
module.exports = router;