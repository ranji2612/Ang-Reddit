app.filter('timeShow', function() {
	return function(n) {
		
		var d2 = new Date();
		var diff = d2.getTime()-n;
		var days = diff / (1000 * 3600 * 24);
		if (days >= 1) 
			return Math.round(days,0) + ' days ago'
		var hours = days * 24;
		if (hours >= 1) 
			return Math.round(hours,0) + ' hours ago'
		var mins = hours * 60;
		if (mins >= 1) 
			return Math.round(mins,0) + ' mins ago'
		return 'Just Now'
	}
});