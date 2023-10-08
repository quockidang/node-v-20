'use strict'

const express = require('express')
const router = express.Router()
const { asyncHandle } = require('../../auth/checkAuth')
const productController = require('../../controllers/product.controller')
const { authentication, authenticationV2 } = require('../../auth/authUtils')

// authentication
router.use(authenticationV2)

router.post('/', asyncHandle(productController.createProduct))

router.put('/published', asyncHandle(productController.publishProductByShop))

// QUERY
router.get('/drafts/all', asyncHandle(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandle(productController.getAllPublishedForShop))
// END QUERY
module.exports = router;