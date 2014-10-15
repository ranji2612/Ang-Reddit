'use strict';

app.factory('PostDetails',function($http) {
	
	return {
		get : function(postId) {
			return $http.get('/api/posts/' + postId);
		},
		create : function(postId,commentData) {
			return $http.post('/api/posts/'+postId, commentData);
		}
	}
});