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
          console.log(issues[0]);
          Session.set('issues', issues);
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

Template.layout.rendered = function(){
  $('.button-collapse').sideNav({
      edge: 'left', // Choose the horizontal origin
      
    }
  );
  Session.set('issues', []);
  Session.setDefault('repos', []);
  title="test"
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
  "change #repoSelect": function(evt) {
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
  }
})