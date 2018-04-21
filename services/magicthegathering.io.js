const mtg = require('mtgsdk');

var toolbox = {
	card: function (input, done) {
		mtg.card.where({
				name: `"${input}"`,	// quotes are required to make a specific search
			})
			.then(card => {
				console.log(card[0])
				done(toolbox.cardInfo(card[0],input));
			})
	},
	manaCost: function (cardCost) {
		return cardCost
			.replace(/{W}/g, ':white:')
			.replace(/{U}/g, ':blue:')
			.replace(/{B}/g, ':black:')
			.replace(/{R}/g, ':red:')
			.replace(/{G}/g, ':green:')
			.replace(/{/g, '*')
			.replace(/}/g, '* ');

	},
	cardInfo: function (card,input) {
		let object = {
			"response_type": "in_channel",
			"text": `Searched for card: *${input}*.\n<http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${card.multiverseid}\|Read additional card details here>`,
			"attachments": [
				{
					title: card.name,
					text: card.text,
					fields: [
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
					image_url: card.imageUrl
				}
			]
		}

		return object;
	}
}

module.exports = toolbox;