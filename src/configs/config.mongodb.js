'use strict'


// level 0
/*
let config = {
    db: {
        host: "localhost",
        port: 27017,
        name: "shopDev"
    }
}
*/
// level 1
const dev = {
    db: {
        host: process.env.DEV_MONGODB_HOST,
        port: process.env.DEV_MONGODB_PORT,
        name: process.env.DEV_MONGODB_DATABASE_NAME
    }
}

const pro = {
    db: {
        host: process.env.PRO_MONGODB_HOST,
        port: process.env.PRO_MONGODB_PORT,
        name: process.env.PRO_MONGODB_DATABASE_NAME
    }
}
const config = {dev, pro}
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];