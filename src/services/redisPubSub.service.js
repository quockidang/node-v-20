'use strict'

const { createClient } = require('redis')

class RedisPubSubService {
    constructor () {
        this.subcriber = createClient({
            password: 'xxxxx',
            socket: {
                host: 'redis-15314.c252.ap-southeast-1-1.ec2.cloud.redislabs.com',
                port: 15314
            }
        })
        this.publisher = createClient({
            password: 'xxxxx',
            socket: {
                host: 'redis-15314.c252.ap-southeast-1-1.ec2.cloud.redislabs.com',
                port: 15314
            }
        })
    }

    async publish ( chanel, message ) {
        await this.publisher.connect()
            this.publisher.publish(chanel, message)
    }

    async subcribe ( chanel, callback ) {
        await this.subcriber.connect()
        await this.subcriber.subscribe(chanel, message => console.log(message))
    }
}

module.exports = new RedisPubSubService()