angular.module('parlmntDeps').controller('applicationController', ['$scope', 'user', function($scope, user) {

  $scope.appTitle = 'Debate Bills and Acts of Parliament';

  $scope.loggedIn = function() {
    return user.loggedIn()
  };

  $scope.setTitle = function(title) {
    $scope.appTitle = title;
  }


}]);