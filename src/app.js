const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// init middlware
app.use(morgan('dev')); // combined, common, short, tiny
app.use(helmet());
app.use(compression());
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// init database
require('./dbs/init.mongodb');
//const { checkOverLoad } = require('./helpers/check.connect')
//checkOverLoad()

// init route
app.use('/', require('./routes/index'))

// handle errors
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal server error'
    })
})
module.exports = app;