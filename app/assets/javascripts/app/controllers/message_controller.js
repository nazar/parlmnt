angular.module('parlmntDeps').controller('messageController', ['$scope', 'message', function($scope, message) {

  $scope.message = {};
  $scope.visible = false;

  $scope.$on('displayMessage', function(e, msg) {
    $scope.$apply(function() {
      $scope.message = msg;
      $scope.visible = true;
    });
  });

  $scope.dismiss = function() {
    $scope.visible = false;
  }

}]);