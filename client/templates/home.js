Template.home.rendered = function(){
	Template.layout.title = "test";
  Session.setDefault('issues', '');
};

Template.home.helpers({
  issues: function () {
    return Session.get('issues');
  }
});

Template.home.events({
  'click .all-issues': function () {
    var token = Meteor.user().services.github.accessToken;
    console.log(token);
    var url = "https://api.github.com/repos/mikedeboer/node-github/issues";
    var options = {
      params: {
        "access_token": token
      }
    };
    HTTP.call("GET", url, options,
      function (error, result) {
        if (error) {
          console.log(error.message);
        } else {
          var issues = result.data;
          for (var i = 0; i < issues.length; i++) {
            var title = issues[i].title;
            var issue = issues[i].body;
            var message = "_::" + title + "::_\n" + issue + "\n\n";
            Session.set('issues', Session.get('issues') + message);
          };
        }
    });
  }
});