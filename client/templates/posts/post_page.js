Template.postPage.helpers({
	comments: function() {
		return Comments.find({postId: this._id});
	}
});

Template.postPage.rendered = function () {
	$('.parallax').parallax();
};