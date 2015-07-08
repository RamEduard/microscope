Template.postEdit.events({
	'click .delete': function(e) {
		e.preventDefault();

		if (confirm('Delete this Post?')) {
			var currentPostId = this._id;
			Posts.remove(currentPostId);
			Router.go('home');
		}
	}
})