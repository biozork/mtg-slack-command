const express = require('express');
const bodyParser = require('body-parser');
const magicthegathering = require('../services/magicthegathering.io.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', function (req, res, next) {
	console.log(req.body);
	console.log(req.payload);

	if (req.body.command == "/card" && req.body.token == process.env.SLACK_KEY) {
		magicthegathering.card(req.body.text, function (card) {
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(card, null, 4))
		})

	} else {

		if (req.body.token != process.env.SLACK_KEY) {
			console.log('Server token: ' + process.env.SLACK_KEY);
			console.log('Request token: ' + req.body.token);
			
			res.end(JSON.stringify({
				"Error": "Your app is not authorized to access this service"
			}))
		} else {
			res.end(JSON.stringify({
				"Error": "Command not recognized"
			}))
		}

	}

});

app.post('/interactive', bodyParser.json(), function (req, res, next) {
	let payload = JSON.parse(req.body.payload);
	console.log(payload);
	res.end()
});

module.exports = app;