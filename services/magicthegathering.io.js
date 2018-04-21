const mtg = require('mtgsdk');

var toolbox = {
	card: function (string, done) {
		mtg.card.where({
				name: string,
			})
			.then(card => {
				console.log(card[0])
				done(toolbox.cardInfo(card[0]));
			})
	},
	manaCost: function (cardCost) {
		return cardCost
			.replace(/{W}/g, ':white:')
			.replace(/{U}/g, ':blue:')
			.replace(/{B}/g, ':black:')
			.replace(/{R}/g, ':red:')
			.replace(/{G}/g, ':green:')
			.replace(/{/g, '')
			.replace(/}/g, ' ');

	},
	cardInfo: function (card) {
		let object = {
			name: card.name,
			fields: [
				{
					"title": "Type",
					"value": card.type,
					"short": true
					},
				{
					"title": "Type",
					"value": toolbox.manaCost(card.manaCost),
					"short": true
					}
				],
			image_url: card.imageUrl
		}
		
		return object;
	}
}

module.exports = toolbox;