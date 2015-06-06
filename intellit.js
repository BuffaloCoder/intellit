if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  // no issues loaded
  Session.setDefault('issues', '');

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.git.helpers({
    issues: function () {
      return Session.get('issues');
    }
  });

  Template.git.events({
    'click .all-issues': function () {
      HTTP.call("GET", "https://api.github.com/repos/mikedeboer/node-github/issues",
        function (error, result) {
          if (error) {
            console.log(error.message);
          } else {
            var issues = result.data;
            for (var i = 0; i < issues.length; i++) {
              var message = Session.get('issues');
              var issue = issues[i].body;
              Session.set('issues', message + issue + '<br>');
              console.log(issue);
            };
          }
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
