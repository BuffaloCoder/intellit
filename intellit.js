if(Meteor.isClient) {
  Meteor.startup(function() {
    $(window).resize(function(evt) {
      Session.set("touch", new Date());
    });
  });


  Accounts.ui.config({
    requestPermissions: {
      github: ['user', 'repo']
    }
  });
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
