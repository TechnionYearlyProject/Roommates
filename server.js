const express = require('express');

const port = process.env.PORT || 3000;

var app = express();

//app.use(express.static(__dirname + '/public')); //register middleware

app.get('/', (request, response) => {
    response.send('<h1>Roommates..</h1><p>you can send me your credit card number if you want :)</p>');
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});