'use strict';

app.controller('postsCtrl', function ($scope,Post,$http) {
	//page data-binding
	
	$scope.posts = [];
	$scope.post  = {title:'',url:''};
	
	//get the list of posts from the server
	Post.get()
		.success(function(data) {
			$scope.posts = data.reverse();
		});
	//upvote
	$scope.tf = function(postId,index) {
		console.log(postId);
		$http.post('/api/posts/upvote/'+postId)
		.success( function(data) {
			if (data.res=='upvoted') {
				$scope.posts[index].cd.pt++;
			}
		});
	};
	//adding a new post
	$scope.addNewPost = function() {
		console.log($scope.post.url);
		$scope.posts.unshift({title:$scope.post.title,url:$scope.post.url,cd:{crt:$scope.security.user.local.username,pt:1,noc:0,tm:(new Date().getTime())}});
		$scope.post  = {title:'',url:''};
		var tnow = new Date().getTime();
		Post.create({title:$scope.posts[0].title,url:$scope.posts[0].url,cd:{tm:tnow}})
			.success(function(data) {
				$scope.posts[0]._id=data._id;
			});
	};
	
	//deleting an existing post created by the user
	$scope.deletePost = function(postId,index) {
		
		$scope.posts.splice(index,1);
		Post.delete(postId);
		
	};
});