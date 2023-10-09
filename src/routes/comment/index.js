'use strict'

const express = require('express')
const commentController = require('../../controllers/comment.controller')
const router = express.Router()
const { asyncHandle } = require('../../auth/checkAuth')

const  {
    authenticationV2
 } = require('../../auth/authUtils')
// authentication
router.use(authenticationV2)
router.post('/', asyncHandle(commentController.createComment))

module.exports = router;