Template.shareButtons.helpers({
	'postUrl': function() {
		return window.location.href;
	}
});

Template.shareButtons.rendered = function () {
    $('a', '#share-buttons').tooltip();
};