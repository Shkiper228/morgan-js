const mongoose = require('mongoose');

module.exports = mongoose.model('Member', new mongoose.Schema({
    id: { type: String }, // Discord ID of the user
	guildID: { type: String }, // ID of the guild to which the member is connected

	/* SERVER ECONOMY */
	money: { type: Number, default: 0 }, // Money of the user
	exp: { type: Number, default: 0 }, // Exp points of the user
	level: { type: Number, default: 0 }, // Level of the user
}))