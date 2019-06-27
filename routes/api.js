const express = require('express');
const bodyParser = require('body-parser');
const magicthegathering = require('../services/magicthegathering.io.js');
const request = require('request');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/', function (req, res, next) {
    console.log(req.body);
    //console.log(req.payload);

    if (req.body.command == "/card" && req.body.token == process.env.SLACK_KEY) {

        let return_url = req.body.return_url;
        let cardReq = req.body.text;

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            "response_type": "ephemeral",
            "text": `Thanks, I will look up *${cardReq}* for you.`
        }));


        magicthegathering.card(cardReq, function (card) {
            request({
                "method": "PUT",
                "headers": {
                    "Content-Type": "application/json"
                },
                "uri": return_url,
                "form": {
                    "payload": card
                }
            }, function (err, httpResponse, body) {
                if (err) {
                    return console.error('post request failed:', err);
                }
            });
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

    if (payload.type == 'interactive_message' && payload.actions[0].name == "rulings") {
        magicthegathering.rulings(payload.callback_id, function (rules) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(rules, null, 4))
        })
    } else if (payload.type == 'interactive_message' && payload.actions[0].name == "card") {
        magicthegathering.card(payload.actions[0].value, function (card) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(card, null, 4))
        })
    } else {
        res.end(JSON.stringify({
            "Error": "Something went wrong"
        }))
    }
});

module.exports = app;
