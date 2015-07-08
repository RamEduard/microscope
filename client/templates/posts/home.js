Template.home.helpers({
  posts: function() {
    return Posts.find({}, {sort: {submitted: -1}});
  }
});

Template.home.rendered = function () {
	$('.parallax').parallax();
};