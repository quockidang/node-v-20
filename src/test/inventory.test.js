'use strict'

const redisPubSubService = require('../services/redisPubSub.service')

class InventoryServiceTest {
    constructor () {
        redisPubSubService.subcribe('purchase_event', (chanel, message) => {
            console.log(chanel, message)
        })
    }
}

module.exports = new InventoryServiceTest()