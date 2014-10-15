var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dbSchema = new Schema({
		uid : String,
		pid : String,
		cid : String
	},{ collection: 'userVoteColl' });

module.exports = mongoose.model('userVoteModel', dbSchema);