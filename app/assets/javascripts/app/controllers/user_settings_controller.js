angular.module('parlmntDeps').controller('userSettingsController', ['$scope', 'user', function($scope, user) {

  $scope.userForm = {};

  user.getUser()
    .then(function(user) {
      $scope.userForm = user;
    });

  $scope.save = function() {
    return user.update({
      name: $scope.userForm.name,
      email: $scope.userForm.email,
      constituency_id: $scope.userForm.constituency_id
    });
  };

}]);