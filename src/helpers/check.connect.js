'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process');

const _SECONDS = 5000;
const countConnect = () => {
    const numConnect = mongoose.connections.length
    console.log(`Number of connection::${numConnect}`)
}

const checkOverLoad = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        console.log(`Active connectio::${numConnection}`)
        console.log(`Memory usage::${memoryUsage / 1024 / 1024} MB`);
        // Example maximun nuymber of connection of base on number of cores
        const maxConnection = numCores * 5;
        if (numConnection > maxConnection) {
            console.log(`Connection overload dected`);
            // notifycation to team
        }
    }, _SECONDS) // monitor every 5 seconds 
}

module.exports = {
    checkOverLoad,
    countConnect
}