'use strict';

app.controller('postDetailsCtrl', function($scope, $location, $routeParams, PostDetails,Post) {
	$scope.post={};
	$scope.cmts={};
	$scope.newComment="";
	PostDetails.get($routeParams.postId)
		.success(function(data) {
			$scope.post=data[0][0];
			$scope.cmts=data[1];
		});
	
	$scope.addComment = function() {

		//Add to comments JSON and Increment Comments number
		$scope.cmts.unshift({cmt:$scope.newComment,pid:$routeParams.postId,crt:$scope.security.user.local.username,tm:(new Date()).getTime()});
		$scope.post.cd.noc++;
		//Increase total no of comments
		$scope.newComment="";
		//Updating in DB
		PostDetails.create($routeParams.postId,$scope.cmts[0])
			.success(function(data) {
				console.log('commented Successfully');
			});
		

		
	};
	
	$scope.deletePost = function(postId) {
		Post.delete(postId);
		$location.path('/home');
	};
	
	$scope.isSameUser = function(username) {
		console.log(username);
		//console.log($scope.security.user.local.username);
		//if (username == $scope.security.user.local.username)
			return true;
		return false;
	};
});