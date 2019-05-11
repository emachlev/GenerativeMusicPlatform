const PORT = 8081;

// server.js
// load the things we need
const express = require('express');
const app = express();
const markov_chains = require('markov-chains');

// set the view engine to ejs
app.set('view engine', 'ejs');
// set the static path
app.use('/static', express.static('static'));

// index page
app.get('/', function (req, res) {
    res.render('pages/index', {
        pieces: [4, 4, 4]
    });
});

app.listen(PORT);
console.log('Listening on: localhost:' + PORT);