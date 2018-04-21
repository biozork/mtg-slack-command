require('dotenv').config();
var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 80;
var host = process.env.HOST || 'localhost';

var api = require('./routes/api.js');

app.use('/', api);

http.listen(port, function () {
    console.log('Server is now running on http://' + host + ':' + port);
});