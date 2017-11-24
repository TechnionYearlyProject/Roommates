const express = require('express');

const port = 3000;

var app = express();

//app.use(express.static(__dirname + '/public')); //register middleware

app.get('/', (request, response) => {
    response.send('<h1>Roommates</h1>');
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});