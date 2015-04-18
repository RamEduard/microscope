Posts = new Mongo.Collection('posts');

Meteor.methods({
    postInsert: function(postAttributes) {
        check(Meteor.userId(), String);
        check(postAttributes, {
            title: String,
            url: String
        });

        var postWithSameLink = Posts.findOne({url: postAttributes.url});
        if (postWithSameLink) {
            return {
                postExists: true,
                _id: postWithSameLink._id
            };
        }

        var user = Meteor.user();
        var post = _.extend(postAttributes, {
            userId: user._id,
            author: user.username,
            submitted: new Date(),
            upvoters: [],
            votes: 0
        });

        var postId = Posts.insert(post);

        return {_id: postId};
    },
    'upvote': function(postId) {
        check(this.userId, String);
        check(postId, String);
        
        var post = Posts.findOne(postId);
        if (!post) 
            return $.notify('Post not found!', 'error');
        
        if (_.include(post.upvoters, this.userId))
            return $.notify('Already upvoted this post!', 'error');

        var affected = Posts.update({
            _id: postId,
            upvoters: {$ne: this.userId}
        }, {
            $addToSet: {upvoters: this.userId},
            $inc: {votes: 1}
        });

        if (! affected)
            return $.notify('You weren\'t able to upvote that post!', 'error');
    }
});

Posts.allow({
    remove: function(userId, post) {
        return ownsDocument(userId, post);
    },
    update: function(userId, post) {
        return ownsDocument(userId, post);
    }
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});