'use strict'

const ProductService = require("../services/product.service")
const { SuccessResponse } = require('../core/success.response')

class ProductController {
    createProduct = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Create new Product success.',
            metadata: await ProductService.createProduct(req.body.product_type, { ...req.body, product_shop: req.user.userId })
        }).send(res)
    }

    // PUT
    publishProductByShop = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Published product success',
            metadata: await ProductService.publishProductByShop({
                product_shop: req.user.userId,
                ...req.body
            })
        }).send(res)
    }

    // END PUT

    // QUERY
    /**
     * @desc Get all drafts for shop
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns { JSON }
     */
    getAllDraftsForShop = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get List Products is Drafts success.',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId 
            })
        }).send(res)
    }

    /**
     * @desc Get all published for shop
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns { JSON }
     */
    getAllPublishedForShop = async (req, res, next) => {
        return new SuccessResponse({
            message: 'Get List Product is Published Success',
            metadata: await ProductService.findAllPublishedForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    // END QUERY
}

module.exports = new ProductController();