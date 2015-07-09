Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() {
        return Meteor.subscribe('notifications');
    }
});

HomeController = RouteController.extend({
    layoutTemplate: 'noContainerLayout',
    template: 'home',
    increment: 12,
    postsLimit: function() {
        return parseInt(this.params.postsLimit) || this.increment;
    },
    findOptions: function() {
        return {
            sort: this.sort,
            limit: this.postsLimit()
        };
    },
    subscriptions: function() {
        this.commentsSub = Meteor.subscribe('comments');
        this.postsSub = Meteor.subscribe('posts', this.findOptions());
    },
    posts: function() {
        return Posts.find({}, this.findOptions());
    },
    data: function() {
        var hasMore = this.posts().count() === this.postsLimit();
        var nextPath = this.route.path({postsLimit: this.postsLimit() + this.increment});
        
        return {
            posts: this.posts(),
            ready: this.postsSub.ready,
            nextPath: hasMore ? nextPath : null
        };
    }
});

NewPostsController = HomeController.extend({
    sort: {createdAt: -1},
    nextPath: function() {
        return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment});
    }
});

BestPostsController = HomeController.extend({
    sort: {votes: -1},
    nextPath: function() {
        return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment});
    }
});

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});

Router.route('/new/:postsLimit?', {
  name: 'newPosts'
});

Router.route('/best/:postsLimit?', {
  name: 'bestPosts'
});

Router.route('/posts/view/:_id', {
    name: 'postPage',
    data: function() {
        return Posts.findOne(this.params._id);
    },
    waitOn: function() {
        return [
            Meteor.subscribe('singlePost', this.params._id),
            Meteor.subscribe('commentsPost', this.params._id),
        ]
    }
});
Router.route('/posts/new', {name: 'postNew'});
Router.route('/posts/edit/:_id', {
    name: 'postEdit',
    data: function() {
        return {
            post: Posts.findOne({
                _id: this.params._id
            })
        };
    },
    waitOn: function() {
        return [
            Meteor.subscribe('singlePost', this.params._id),
            Meteor.subscribe('commentsPost', this.params._id),
        ]
    }
});

Router.onBeforeAction('dataNotFound', {only: 'postPage'});

Router.plugin('ensureSignedIn', {
    only: ['postNew', 'postEdit']
});