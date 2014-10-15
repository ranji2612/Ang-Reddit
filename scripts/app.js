var app = angular.module('mainApp', ['ngRoute']);
  

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'html/posts.html',
		controller : 'postsCtrl'
      })
	  .when('/posts/:postId', {
	  	templateUrl : 'html/showPost.html',
		controller : 'postDetailsCtrl'
	  })
      .when('/about', {
        templateUrl: 'html/about.html'
      })
	  .when('/profile', {
		templateUrl: 'html/profile.html'
	  })	
      .otherwise({
        redirectTo: '/home'
      });
	
	// use the HTML5 History API
	$locationProvider.html5Mode(true);
});


app.controller('homeCtrl', function ($scope,$http,$location) {
	
    //For security
	$scope.security = {user:'', isAuthenticated : false};
	$scope.loginMessage = "";
	$http.get('/loggedin')
				.success(function(data) {
					if (data != 0) {
						$scope.security.user=data;
						$scope.security.isAuthenticated=true;
					}
					else { $scope.security.user=''; $scope.security.isAuthenticated=false;	}
				})
				.error(function(data) {
					console.log('get loggedin failed: ' + data);
				});
	//TO check if user is authorised
	$scope.updateAuthenticated = function() {
		$http.get('/loggedin')
				.success(function(data) {
					if (data != 0) {
						$scope.security.user=data;
						$scope.security.isAuthenticated=true;
						$scope.loginMessage = "";
					}
				})
				.error(function(data) {
					console.log('Error: ' + data);
					//Unauthorised User
					$scope.loginMessage = 'Wrong Username/Password';
				});
	};
	$scope.clearFields = function() {
		$scope.username="";
		$scope.password="";
		$scope.su_username="";
		$scope.su_password="";
		$scope.su_email="";
		$scope.su_password2="";
		$scope.errorMsg="";
	};
	//Sigining in process
	$scope.securityLogin = function (username, password) {
		$scope.clearFields();
		$http.post('/signin', { 'username' : username, 'password': password})
			.success(function(data) {
					//Update user's authentication
					$scope.updateAuthenticated();
			});
	};
	//Sigining up process

	$scope.securitySignup = function (username, email, password, password1) {
		//Validations
		if ((username=="") || (email=="") || (password=="") || (password1=="")) {
			$scope.errorMsg = "Please fill all boxes";
			return;
		}
		if (password != password1) {
			console.log('asdasdas');
			$scope.errorMsg = "Passwords Didnt Match...";
			return;
		}
		
		$http.post('/checkunameandemail',{username:username,email:email})
		.success( function(data) {
			$scope.isAccepted = console.log(data);
			
			if((data.username==0) && (data.email==0)) {
				// Both Email and Username are new
						
				var request = $http.post('/signup', { 'username' : username, 'password': password, 'email':email});
				request.success(function (data, status, header,message) {
					$http.get('/loggedin')
					.success(function(data) {
						//Update user's authentication
						console.log(data);
						$scope.updateAuthenticated();
						$scope.errorMsg = "";
						$scope.clearFields();
					})
					.error(function(data) {
						$scope.errorMsg = "Passwords Didnt Match...";
						console.log('Error: ' + data);
					});

				}); 
			} else {
				if(data.username) $scope.errorMsg = "Username Exists.";
				if(data.email) $scope.errorMsg += " Email Id Exists";
				
			}
		})
		.error( function(data) {
			console.log('Error'+data);
		});

	};
	$scope.logout = function() {
		$http.get('/logout')
			.success( function(data) {
				 $scope.security.user=''; $scope.security.isAuthenticated=false;
			});
	};
	
	//For menu
	$scope.gotoHome =function() {
		$scope.menuButtonClick(0);
		$location.path('/home');
	};
	$scope.menuBarButton=['a','',''];
	$scope.menuButtonClick = function(a) {
		
		$scope.menuBarButton=["","",""];
		$scope.menuBarButton[a]="a";
	};
	
	//Login and signup related
	$scope.showLogin=true;
	$scope.toggleSignin = function() {
		$scope.clearFields();
		$scope.showLogin = !$scope.showLogin;
	}
	
});

app.directive("loginPage", function ($scope) {
    return {
        restrict: "E",
        scope: {},
        replace: true,
        templateUrl: "html/about.html",
        controller: function ($scope) {
            
        }
    }
});