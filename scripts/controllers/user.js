//scripts/controllers/user.js
'use strict';

app.controller('userCtrl', function($scope,$http, transformRequestAsFormPost) {
	$scope.signin = function() {
		console.log('Signing in...');
		
	};
	
	$scope.signup = function() {
		console.log('Signing up for new Account');
	};
	
});

