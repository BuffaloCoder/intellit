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

function createIssue(options) {
  var url = Session.get('repo_url') + "/issues";
  HTTP.post(url, options,
      function (error, res) {
        if (error) {
          console.log(error.message);
        } else {
          console.log(res);
        }
    });
}

function getRepos() {
  try {
    var token = Meteor.user().services.github.accessToken;
  } catch (error) { // not logged in yet
    return;
  }
  var options = {
    params: {
      "access_token": token
    }
  };
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
  return Session.get('repos');
}

function getAssignees() {
  var token = Meteor.user().services.github.accessToken;
  var options = {
    params: {
      "access_token": token
    }
  };
  var url = Session.get('repo_url') + "/assignees";
  HTTP.get(url, options,
      function (error, res) {
        if (error) {
          console.log(error.message);
        } else {
          var assignees = [];
          for (var i = 0; i < res.data.length; i++) {
            var name = res.data[i].login;
            assignees.push({name: name});
          }
          Session.set('assignees', assignees);
        }
    });
}

Template.home.rendered = function(){
	Template.layout.title = "test";
  Session.setDefault('issues', '');
  Session.setDefault('repos', []);
  Session.setDefault('repo_url', '');
  Session.setDefault('assignees', []);
};

Template.home.helpers({
  issues: function () {
    return Session.get('issues');
  },
  repo: function () {
    return getRepos();
    // return Session.get('repos');
  },
  assignee: function () {
    return Session.get('assignees');
  },
});

Template.home.events({
  'submit .create-issue': function (event) {
    var title = event.target.title.value;
    var body = event.target.body.value;
    var assigneeElement = event.target.assigneeSelect;
    var assignee = assigneeElement.options[assigneeElement.selectedIndex].text;
    var milestone = event.target.milestone.value;
    // need to parse into array or something
    var labels = event.target.labels.value;

    var token = Meteor.user().services.github.accessToken;
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
    createIssue(options);

    // clear form
    event.target.title.value = "";
    event.target.body.value = "";
    // event.target.assignee.value = "";
    event.target.milestone.value = "";
    event.target.labels.value = "";

    return false;
  },
  "change #repoSelect": function(evt) {
    Session.set("repo_url", $(evt.target).val());
    
    var token = Meteor.user().services.github.accessToken;
    var options = {
      params: {
        "access_token": token
      }
    };
    getIssues(Session.get("repo_url") + "/issues", options);
    getAssignees();
  }
});