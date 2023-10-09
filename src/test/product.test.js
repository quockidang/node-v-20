'use strict'

const redisPubSubService = require('../services/redisPubSub.service')


class ProductServiceTest {
    async purchaseProduct ( productId, quantity ) {
        const order = {
            productId,
            quantity
        }

        await redisPubSubService.publish('purchase_event', JSON.stringify(order))
    }
}

module.exports = new ProductServiceTest()