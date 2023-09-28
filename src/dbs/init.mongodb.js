'use strict'

const mongoose = require('mongoose');
const {db: {host, port, name}} =  require('../configs/config.mongodb');
const connectStr = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        mongoose.connect(connectStr)
            .then(_ => console.log(`Connect mongoose success... with connection string: ${connectStr}`))
            .catch(err => console.log(err));
        mongoose.set('debug', true);
        mongoose.set('debug', {color: true});
    }

    static getInstance () {
        if(! Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;