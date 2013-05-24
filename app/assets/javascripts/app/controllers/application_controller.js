angular.module('parlmntDeps').controller('applicationController', ['$scope', 'user', function($scope, user) {

  $scope.loggedIn = function() {
    return user.loggedIn()
  };


}]);