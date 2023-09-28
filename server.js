
require('dotenv').config();

const app = require('./src/app');
const PORT = process.env.PORT || 3055;
const server = app.listen(PORT, () =>{
    console.log(`WSV start with port ${PORT}`)
});

process.on('SIGN', () => {
    server.close(() => `Exit server express`);
})