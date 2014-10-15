// DB Model Files
var postModel	= require('../models/postModel');
var cmtModel 	= require('../models/cmtModel');
var UserModel  	= require('../models/userModel');
var userVoteModel  	= require('../models/userVoteModel');
var mongoose 	= require('mongoose');
var ObjectId 	= mongoose.Types.ObjectId;

var auth = function(req, res, next) {
	if (!req.isAuthenticated())
		res.send(401); 
	else
		next();
};

module.exports = function(app, passport) {

	// api ---------------------------------------------------------------------
	app.get('/home', function(req, res){
		
		res.sendfile('public/html/home.html');	
		
	});
	
	app.get('/posts/543d061092c3710423000001', function(req, res){
		
		res.sendfile('public/html/home.html');	
		
	});
	
	app.get('/login', function(req, res) {
		res.sendfile('public/html/home.html'); 
		// load the single view file (angular will handle the page changes on the front-end)
	});
	
	
	// For 'posts' API Calls
	
	app.route('/api/posts')
	
		.get(function(req, res) {
			
			postModel.find({},{ title: 1, url: 1, cd: 1},function(err,posts) {
				if (err) {
					res.send(err);
				}
				res.json(posts);
			});
		})	
		
		.post(function(req, res) {
			
			postModel.create({ title:req.body.title , url:req.body.url, 'cmts':[] , 'cd':{ crt: req.user.local.username, noc:0,pt:1,tm:req.body.cd.tm}},function(err,newPost) {
				if (err) {
					res.send(err);
				}
				res.json({_id:newPost._id});
				// Not sending the JSON, since its just the new element it can be added there itself. This is Just to add to DB. No point in sending a big JSON back
			});
		});
	// Upvote
	app.route('/api/posts/upvote/:post_id')
		.post( function(req,res) {
		console.log('Reached here-------------------------');
		var s = 'cmts.'+req.user.id;
		console.log(s);
		userVoteModel.findOne({uid: req.user.id, pid:req.params.post_id}, function(err,post) {
			console.log(post);
			if (err) {
				res.send(err);
			}
			if(post)
				res.json({res:'Already upvoted'});
			else {
				postModel.update({_id:req.params.post_id},{$inc: {"cd.pt": 1}}, function(err) {
					if (err) {
						res.send(err);
					}
					//for post add to pid
					userVoteModel.create({uid:req.user.id, pid:req.params.post_id}, function(err, data) {
						if (err)
							res.send(err);
						res.json({res:'upvoted'});
					});
							
					});
				}
			});
			/*postModel.update({_id:req.params.post_id},{$inc: {"cd.pt": 1}}, function(err) {
					if (err) {
						res.send(err);
					}
				});*/
	});
	app.route('/api/posts/:post_id')
		
		.delete(function(req, res) {
			
			postModel.remove({ _id : req.params.post_id },function(err) {
				if (err) {
					res.send(err);
					res.end();
				}
				cmtModel.remove({pid:req.params.post_id },function(err) {
					if (err) {
						res.send(err);
						res.end();
					}
				});
			});
		})
		//Get all the coments and posts when a user clicks a post
		.get(function(req, res){
			
			cmtModel.find({pid:ObjectId.fromString(req.params.post_id)}, function(err,cmts) {
				if (err) {
					res.send(err);
					res.end();
				}
				
				postModel.find({ _id : ObjectId.fromString(req.params.post_id) },function(err,post) {
					if (err) {
						res.send(err);
						res.end();
					}
					res.json([post,cmts]);
				});
			});
		})
		
	//Add a new comment in the posts page
		.post(function(req, res) {
		
			cmtModel.create({cmt:req.body.cmt, pid:ObjectId.fromString(req.params.post_id), crt: req.body.crt, tm: req.body.tm}, function(err) {
				if (err) {
					res.send(err);
					res.end();
				}
				postModel.update({_id:req.params.post_id},{$inc: {"cd.noc": 1}}, function(err) {
					if (err) {
						res.send(err);
					}
				});
			});
		
		})
		
		.put(function(req, res){
		
			console.log('Reached Update'+req.params.post_id);
		});
	
	
	//Authentication related
	//route to test if the user is logged in or not 
	app.get('/loggedin', function(req, res) { 	
		console.log('Requesting for auth validation');
		res.send(req.isAuthenticated() ? req.user : 0);
	});
	
	app.post('/checkunameandemail', function(req,res) {
		console.log('Requesting for username and password validation');
		
		 UserModel.findOne({ 'local.username' :  req.body.username }, function(err, user) {
			 console.log(user);
			 if(user) {
				 UserModel.findOne({ 'local.email' :  req.body.email }, function(err, user) {
					 if(user) {
						 res.json({username:1, email:1});
					 }
					 res.json({username:1, email:0});
				 });
			 }
				 
			 UserModel.findOne({ 'local.email' :  req.body.email }, function(err, user) {
					 if(user) {
						 res.json({username:0, email:1});
					 }
					 res.json({username:0, email:0});
				 });
		 });
	});
	
	app.get('/logout', function(req, res) {
		console.log('Logging out');
		req.logout();
		res.redirect('/home');		
	});
	
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	app.post('/signin', passport.authenticate('local-signin', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/home', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated()) {
		console.log('AUthenticated User');
		return next();
	}
	console.log('Not Authenticated');
	// if they aren't redirect them to the home page
	res.redirect('/home');
}

	
