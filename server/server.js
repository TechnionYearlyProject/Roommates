const express = require('express');

const serverConfig = require('./server-config');
const dbConnection = require('./DB/dbConnection');

const app = express();


//app.use(express.static(__dirname + '/public')); //register middleware

app.get('/', (request, response) => {
    response.send('<h1>CI Test</h1><h1>Roommates..</h1><p>you can send me your credit card number if you want :)</p>');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}`);
});