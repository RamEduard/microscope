UI.registerHelper('pluralize', function(n, thing) {
	//faily stupid pluralizer
	if (n === 1) 
		return thing;
	else 
		return thing + 's';
});