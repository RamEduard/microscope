Template.home.helpers({
  posts: function() {
    return Posts.find({}, {sort: {submitted: -1}});
  }
});