// server.js
// load the things we need
const express = require('express');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
// set the static path
app.use('/static', express.static('static'));

// index page
app.get('/', function (req, res) {
    res.render('pages/index');
});

app.listen(8080);
console.log('Listening on: localhost:8080');