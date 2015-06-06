Template.layout.rendered = function(){
  $('.button-collapse').sideNav({
      edge: 'left', // Choose the horizontal origin
      
    }
  );
  title="test"
};

Template.layout.helpers({
  isCurrentPage: function(pageName){
    var currentName = Router.current().route.getName();
    return currentName == pageName;
  }
});