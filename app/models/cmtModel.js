var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var cmtSchema = new Schema({
	cmt : String,
	pid : Schema.ObjectId,
	crt : String,
	tm  : Number
},{collection : 'postCommentsColl'});

module.exports = mongoose.model('cmtModel',cmtSchema);