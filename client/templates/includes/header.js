Template.header.events({
  'click #sign-out': function (event) {
    event.preventDefault();
    Meteor.logout();
    Router.go("/");
  },
  'click a:not(".dropdown-button")': function(event) {
    event.preventDefault();
    window.location.href = event.target.href;
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