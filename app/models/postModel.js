var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dbSchema = new Schema({
		title : String,
		url   : String,
		cmts  : Array,
		cd	  : {
			crt:String,
			noc:Number,
			pt:Number,
			tm:Number
		}
	},{ collection: 'postModelColl' });

module.exports = mongoose.model('postModel', dbSchema);