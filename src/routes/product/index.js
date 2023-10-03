'use strict'

const express = require('express')
const router = express.Router()
const { asyncHandle } = require('../../auth/checkAuth')
const productController = require('../../controllers/product.controller')
const { authentication } = require('../../auth/authUtils')

// authentication
router.use(authentication)

router.post('/', asyncHandle(productController.createProduct))
module.exports = router;