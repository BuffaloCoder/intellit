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