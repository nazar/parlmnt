angular.module('parlmntDeps').controller('applicationController', ['$scope', 'user', function($scope, user) {

  $scope.loggedIn = function() {
    return user.loggedIn()
  };

  $scope.setTitle = function(title) {
    $('html title').text(title);

    if(typeof(piwikTracker) != 'undefined') {
      piwikTracker.trackPageView(title);
    }
  };

  $scope.userName = function() {
    return user.userName();
  };

  $scope.$on('displayMessage', function(event, title, msg) {
    $.gritter.add({
      title: title,
      text: msg,
      sticky: false,
      time: 2500
    });

  });

  $scope.setTitle('Debate Bills and Acts of Parliament');



}]);