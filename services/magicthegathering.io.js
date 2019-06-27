const mtg = require('mtgsdk');

var toolbox = {
	rulings: function (multiverseId, done) {
		mtg
			.card
			.find(multiverseId)
			.then(result => {
				done(toolbox.cardRules(result.card))
			});
	},
	cardRules: function (card) {
		if (card.rulings.length > 0) {
			let object = {
				"response_type": "ephemeral",
				"text": `Rulings for card: *${card.name}*.`,
				"attachments": []
			}
			for (let i = 0; i < card.rulings.length; i++) {
				object.attachments.push({
					"title": `Date: ${card.rulings[i].date}`,
					"text": card.rulings[i].text
				})
			}

			object.attachments.push({
				"title": 'View ' + card.name,
				"callback_id": card.multiverseid,
				"attachment_type": "default",
				"actions": [
					{
						"name": "card",
						"type": "button",
						"text": "View card",
						"style": "primary",
						"value": card.name
						}
					]
			})

			console.log(object);
			return object;
		}
	},
	card: function (input, done) {
		console.log('Card name retrieved: ' + input);
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
					"callback_id": card.multiverseid,
					"attachment_type": "default",
					"fields": [
						{
							"title": "Type",
							"value": card.type,
							"short": true
						},
						{
							"title": "Cost",
							"value": toolbox.manaCost(card.manaCost) + ` (${card.cmc} cmc)`,
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
				"style": "primary",
				"value": "listrulings"
			})
		}

		return object;
	}
}

module.exports = toolbox;