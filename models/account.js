var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
	username: String,
	password: String,
	properties: [String],
	shared:[Boolean],
	objName:String,
	objects: [[String]],
	identifier: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
