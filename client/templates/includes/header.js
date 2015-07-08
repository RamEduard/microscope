Template.header.events({
  'click #sign-out': function (event) {
    Meteor.logout();
    Router.go("/");
  }
});

Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    var active = _.any(args, function(name) {
      return Router.current() && Router.current().route.getName() === name
    });

    return active && 'active';
  }
});

Template.header.rendered = function() {
	$('.button-collapse').sideNav();
	$('.dropdown-button').dropdown();
};