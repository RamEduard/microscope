Posts = new Mongo.Collection('posts');

Posts.attachSchema(new SimpleSchema({
    author: {
        type: String,
        autoValue: function() {
            var user = Meteor.user();
            if (this.isInsert) {
                return getUserName(user);
            } else if (this.isUpsert) {
                return {
                    $setOnInsert: getUserName(user)
                };
            } else {
                this.unset();
            }
        },
    },
    category: {
        type: String,
        label: "Post Category"
    },
    description: {
        type: String,
        label: 'Post Description',
        optional: true,
        max: 20000,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                height: 300,
                minHeight: 300,
                toolbar: [
                    ['style', ['style']],
                    ['font', ['bold', 'italic', 'underline', 'clear']],
                    ['para', ['ul', 'ol']],
                    ['insert', ['link','hr']],
                    ['misc', ['codeview']]
                ],
                styleWithSpan: false
            }
        }
    },
    // Automatically set HTML content based on markdown content
    // whenever the markdown content is set.
    htmlDescription: {
        type: String,
        optional: true,
        autoValue: function(doc) {
            var htmlContent = this.field("description");
            if (Meteor.isServer && htmlContent.isSet) {
                return cleanHtml(htmlContent.value);
            }
        }
    },
    imageUrl: {
        type: String,
        label: 'Post Image URL',
        regEx: SimpleSchema.RegEx.Url,
        optional: true
    },
    tags: {
        type: [String],
        optional: true
    },
    title: {
        type: String,
        label: "Post Title",
        max: 200
    },
    upvoters: {
        type: [String],
        optional: true,
        defaultValue: []
    },
    userId: {
        type: String,
        label: "User Id",
        autoValue: function() {
            if (this.isInsert) {
                return Meteor.userId();
            } else if (this.isUpsert) {
                return {
                    $setOnInsert: Meteor.userId()
                };
            } else {
                this.unset();
            }
        },
        denyUpdate: true
    },
    votes: {
        type: Number,
        defaultValue: 0,
        optional: true
    },
    // Force value to be current date (on server) upon insert
    // and prevent updates thereafter.
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {
                    $setOnInsert: new Date()
                };
            } else {
                this.unset();
            }
        },
        denyUpdate: true
    },
    // Force value to be current date (on server) upon update
    // and don't allow it to be set upon insert.
    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true
    }
}));

Meteor.methods({
    'upvote': function(postId) {
        check(this.userId, String);
        check(postId, String);

        var post = Posts.findOne(postId);
        if (!post)
            throw new Meteor.Error('Post not found!', 'error');

        if (_.include(post.upvoters, this.userId))
            throw new Meteor.Error('Already upvoted this post!', 'error');

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
    insert: function(userId, doc) {
        return userId && doc && userId === doc.userId;
    },
    update: function(userId, doc, fieldNames, modifier) {
        return (!_.contains(fieldNames, 'htmlDescription') && userId && doc && userId === doc.userId);
    },
    remove: function(userId, doc) {
        return (userId && doc && userId === doc.userId);
    },
    fetch: ['userId']
});

// Posts.deny({
//   update: function(userId, post, fieldNames) {
//     // may only edit the following two fields:
//     return (_.without(fieldNames, 'imageUrl', 'title').length > 0);
//   }
// });

// Posts.deny({
//   update: function(userId, post, fieldNames, modifier) {
//     var errors = validatePost(modifier.$set);
//     return errors.title || errors.url;
//   }
// });
