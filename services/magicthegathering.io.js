const mtg = require('mtgsdk');

var toolbox = {
	card: function (input, done) {
		mtg.card.where({
				name: `"${input}"`, // quotes are required to make a specific search
			})
			.then(card => {
				//console.log(card[0])
				done(toolbox.cardInfo(card[0], input));
			})
	},
	manaCost: function (str) {

		return (str != undefined) ? str
			.replace(/{W}/g, ':white:')
			.replace(/{U}/g, ':blue:')
			.replace(/{B}/g, ':black:')
			.replace(/{R}/g, ':red:')
			.replace(/{G}/g, ':green:')
			.replace(/{T}/g, ':tap:')
			.replace(/{C}/g, ':colorless:')
			.replace(/{/g, '*')
			.replace(/}/g, '* ') : '';

	},
	cardInfo: function (card, input) {
		let object = {
			"response_type": "in_channel",
			"text": `Searched for card: *${input}*.`,
			"attachments": [
				{
					"title": card.name,
					"text": toolbox.manaCost(card.text),
					"callback_id": "temp1234",
					"attachment_type": "default",
					"fields": [
						{
							"title": "Type",
							"value": card.type,
							"short": true
						},
						{
							"title": "Cost",
							"value": toolbox.manaCost(card.manaCost),
							"short": true
						}
					],
					"image_url": card.imageUrl,
					"actions": [
						{
							"type": "button",
							"text": "View on Oracle",
							"url": `http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${card.multiverseid}`,
							"style": "primary"
						}
					]
				}
			]
		}

		if (card.rulings != undefined && card.rulings.length > 0) {
			object.attachments[0].actions.push({
				"name": "rulings",
				"type": "button",
				"text": "View rulings",
				"style": "warning",
				"value": "listrulings"
			})
		}

		return object;
	}
}

module.exports = toolbox;