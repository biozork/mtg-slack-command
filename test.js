var request = require('request');

var card = {
    "response_type": "in_channel",
    "text": "Searched for card: *Vizzerdrix*.\n<http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=20188|Read additional card details from Oracle here>",
    "attachments": [
        {
            "title": "Vizzerdrix",
            "text": "",
            "fields": [
                {
                    "title": "Type",
                    "value": "Creature — Rabbit Beast",
                    "short": true
                },
                {
                    "title": "Cost",
                    "value": "*6* :blue:",
                    "short": true
                }
            ],
            "image_url": "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=20188&type=card",
            "actions": [
                {
                    "type": "button",
                    "text": "Book flights 🛫",
                    "url": "https://flights.example.com/book/r123456"
				}
			  ]
        }
    ]
}
var return_url = "https://hooks.slack.com/commands/TA88ATY92/678480323653/lOtw49wBeIfQpl6Sa2Bgk2Y2"

request({
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    "uri": return_url,
    "form": {
        "payload": card
    }
}, function(err, res, body){
    if(err){
        console.log(err);
    }
})
