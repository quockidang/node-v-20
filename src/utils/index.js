'use strict'

const _ = require('lodash')

const getInfoData = ({fields = [], object = {}}) => {
    console.log(fields, object)
    return _.pick( object, fields )
}

module.exports = {
    getInfoData
}