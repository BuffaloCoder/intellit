function getIssues (url, options) {
  HTTP.get(url, options,
      function (error, res) {
        if (error) {
          console.log(error.message);
        } else {
          var issues = res.data;
          var message = "";
          for (var i = 0; i < issues.length; i++) {
            var title = issues[i].title;
            var issue = issues[i].body;
            // format message for markdown
            message += "_::" + title + "::_\n" + issue + "\n\n";
          };
          Session.set('issues', message);
        }
    });
}

function createIssue(user, repo, options) {
  var url = "https://api.github.com/repos/" + user + "/" + repo + "/issues";
  HTTP.post(url, options,
      function (error, res) {
        if (error) {
          console.log(error.message);
        } else {
          console.log(res);
        }
    });
}

function getRepos(options) {
  var url = "https://api.github.com/user/repos";
  var repos = {};
  HTTP.get(url, options,
      function (error, res) {
        if (error) {
          console.log(error.message);
        } else {
          var repos = [];
          for (var i = 0; i < res.data.length; i++) {
            var name = res.data[i].name;
            var url = res.data[i].url;
            repos.push({name: name, url: url});
          }
          Session.set('repos', repos);
        }
    });
}

Template.home.rendered = function(){
	Template.layout.title = "test";
  Session.setDefault('issues', '');
  Session.setDefault('repos', []);
  Session.setDefault('repo_url', '');
};

Template.home.helpers({
  issues: function () {
    return Session.get('issues');
  },
  repo: function () {
    console.log(Session.get('repos'));
    return Session.get('repos');
  },
});

Template.home.events({
  'click .all-issues': function () {
    var token = Meteor.user().services.github.accessToken;
    var options = {
      params: {
        "access_token": token
      }
    };
    // var url = "https://api.github.com/repos/mikedeboer/node-github/issues";
    getIssues(Session.get("repo_url") + "/issues", options);
  },
  'click .create-issue': function () {
    console.log(Meteor.user());
    // these should be parameters
    var title = "Found another bug";
    var body = "I'm having a problem with this.";
    var assignee = "dwrvnmnr";
    var milestone = 1;
    var labels = ["Label1", "Label2"];
    //
    var token = Meteor.user().services.github.accessToken;
    var username = Meteor.user().services.github.username;
    var options = {
      data: {
        "title": title,
        "body": body,
        "assignee": assignee,
        // "milestone": milestone,
        // "labels": labels
      },
      params: {
        "access_token": token
      }
    };
    var user = "dwrvnmnr";
    var repo = "intellit";
    createIssue(user, repo, options);
  },
  'click .get-repos': function () {
    var token = Meteor.user().services.github.accessToken;
    var user = Meteor.user().services.github.username;
    var options = {
      params: {
        "access_token": token
      }
    };
    getRepos(options);
  },
  "change #repoSelect": function(evt) {
    Session.set("repo_url", $(evt.target).val());
    console.log(Session.get("repo_url"));
  }
});