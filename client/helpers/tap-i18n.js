getUserLanguage = function () {
  // Put here the logic for determining the user language
  var lang = window.navigator.language || window.navigator.userLanguage;

  if (lang.search('en') > -1)
    return 'en';
  if (lang.search('es') > -1)
    return 'es';

  return 'en';
};

if (Meteor.isClient) {
  Meteor.startup(function () {
    Session.set("showLoadingIndicator", true);

    TAPi18n.setLanguage(getUserLanguage())
      .done(function () {
        Session.set("showLoadingIndicator", false);
      })
      .fail(function (error_message) {
        // Handle the situation
        console.log(error_message);
      });
  });
}