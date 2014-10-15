'use strict';

app.filter('getDomain', function() {
	
	return function(str) {
		var url = document.createElement('a');
		url.href=str;
		return url.hostname;
	}
});