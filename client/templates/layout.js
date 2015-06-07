function getIssues (url, options) {
  HTTP.get(url, options,
      function (error, res) {
        if (error) {
          console.log(error.message);
        } else {
          var issues = res.data;
          Session.set('issues', issues);
        }
    });
}

function closeIssue(number) {
  var url = Session.get('repo_url') + "/issues/" + number;
  var token = Meteor.user().services.github.accessToken;
    var options = {
      data: {
        "state": "closed"
      },
      params: {
        "access_token": token
      }
    };
  HTTP.call("PATCH", url, options,
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

Template.layout.rendered = function(){
  $('.button-collapse').sideNav({
      edge: 'left', // Choose the horizontal origin
    }
  );
  Session.setDefault('issues', []);
  Session.setDefault('repos', []);
};

Template.layout.helpers({
  isCurrentPage: function(pageName){
    var currentName = Router.current().route.getName();
    return currentName == pageName;
  },
  repos: function(){
    return getRepos();
  },
  issues: function () {
    return Session.get('issues');
  }
});

Template.layout.events({
  "click .issue-selection": function(evt) {
    Session.set('issue', this);
  },
  "change .repo-select": function(evt) {
    Session.set("repo", $('#repoSelect option:selected').text());
    Session.set("repo_url", $(evt.target).val());
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
    getIssues(Session.get("repo_url") + "/issues", options);
    getAssignees();
  },
  "click .issueState": function(evt) {
    closeIssue(evt.target.value);
    evt.target.style.display = 'none';
  }
})