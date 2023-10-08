'use strict'

const { product, electronic, clothing, furniture } =  require('../../models/product.model')
const { Types } = require('mongoose')


// QUERY
const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await product.find( query )
        .populate('product_shop', 'name email -_id')
        .sort({ 'updatedAt': -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findAllPublishedForShop = async ({ query, limit, skip }) => {
    return await product.find( query )
        .populate('product_shop', 'name email -_id')
        .sort({ 'updatedAt': -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

// END QUERY

const publishProductByShop =  async ({ product_shop, product_id }) => {
    const foundProduct = product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
    })
    if (! foundProduct) return null

    foundProduct.isDraft = false
    foundProduct.isPublished = true
    await foundProduct.save()

    return foundProduct;
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishedForShop
}

