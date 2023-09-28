const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// init middlware
app.use(morgan('dev')); // combined, common, short, tiny
app.use(helmet());
app.use(compression());
// init database
require('./dbs/init.mongodb');


app.get('/', (req, res, next) => {
    const strCompression = "compression hello world";
    return res.status(200).json({
        message: "Success",
        metadata: strCompression.repeat(10000)
    })
})
// handle errors
module.exports = app;