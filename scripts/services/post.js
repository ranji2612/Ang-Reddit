app.factory('Post',function($http) {
	
	return {
		get : function() {
			return $http.get('/api/posts');
		},
		create : function(postData) {
			return $http.post('/api/posts' , postData);
		},
		put : function(postId) {
			return $http.put('/api/posts/' + postId);
		},
		delete : function(postId) {
			return $http.delete('/api/posts/' + postId);
		}
	}
	
});

