const express = require('express');
const bodyParser = require('body-parser');
const magicthegathering = require('../services/magicthegathering.io.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.post('/', bodyParser.json(), function (req, res, next) {

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


	/*
	var newChart = {};
	newChart.name = req.body.name;
	newChart.data = [];
	newChart.links = [];
	newChart.options = {
		marker: true,
		progress: false,
		public: false,
		zoom: true,
		starttime: true,
		duration: true,
		chartscale: true,
		tooltip: false
	};
	if (req.user.googleID) {
		newChart.googleID = req.user.googleID;
	} else {
		newChart.facebookID = req.user.facebookID;
	}

	//console.log(newChart);

	firebaseTools.createChart(newChart, function (newKey) {
		res.end(JSON.stringify({
			key: newKey
		}));
	});
	*/

});

module.exports = app;