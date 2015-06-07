
function createIssue(options) {
  var url = Session.get('repo_url') + "/issues";
  HTTP.post(url, options,
      function (error, res) {
        if (error) {
          console.log(error.message);
        } else {
          Session.set('createIssueRes', res.data.data);
        }
    });
  return Session.get('createIssueRes');
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

Template.home.rendered = function(){
	Template.layout.title = "test";
  Session.setDefault('issue', '');
  Session.setDefault('repo', '');
  Session.setDefault('repo_url', '');
  Session.setDefault('assignees', []);
  Session.setDefault('createIssueRes', {});
};

Template.home.helpers({
  isOpen: function (state) {
    return state == 'open';
  },
  issue: function () {
    return Session.get('issue');
  },
  repo: function () {
	  try {
	    var token = Meteor.user().services.github.accessToken;
	  } catch (error) { // not logged in yet
	    return;
	  }
    return Session.get('repo');
  },
  assignee: function () {
    return Session.get('assignees');
  }
});

Template.home.events({
  'submit .create-issue': function (event) {
    var title = event.target.title.value;
    var body = event.target.body.value;
    var assigneeElement = event.target.assigneeSelect;
    var assignee = assigneeElement.options[assigneeElement.selectedIndex].text;
    // var milestone = event.target.milestone.value;
    // // need to parse into array or something
    // var labels = event.target.labels.value;

    var token = Meteor.user().services.github.accessToken;
    var options = {
      data: {
        "title": title,
        "body": body,
        "assignee": assignee//,
        // "milestone": milestone,
        // "labels": labels
      },
      params: {
        "access_token": token
      }
    };
    var newIssue = createIssue(options);
    console.log(newIssue);

    // clear form
    event.target.title.value = "";
    event.target.body.value = "";
    // event.target.milestone.value = "";
    // event.target.labels.value = "";

    // update sidebar
    var issues = Session.get('issues')
    issues.push(newIssue);
    Session.set('issues', issues);

    $('#modal').closeModal();
    return false;
  },
  "click .issueState": function(evt) {
    closeIssue(evt.target.value);
    evt.target.style.display = 'none';
  }
});