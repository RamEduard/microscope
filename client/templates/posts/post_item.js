Template.postItem.events({
    'click #upvote-button': function(e) {
        if (!Meteor.userId()) {
            return $.notify('You need sign in to upvote!', 'error');
        }
        else {
            Meteor.call('upvote', this._id);
        }
    }
});

Template.postItem.helpers({
    commentsCount: function() {
        return Comments.find({postId: this._id}).count();
    },
    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        return a.hostname;
    },
    ownPost: function() {
        return this.userId === Meteor.userId();
    },
    upvotedClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.upvoters, userId))
            return 'btn-primary upvotable';
        else 
            return 'btn-default disabled';
    }
});