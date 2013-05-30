angular.module('parlmntDeps').controller('userSettingsController', ['$scope', '$rootScope', 'user', function($scope, $rootScope, user) {

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
    }).success(function(){
      $rootScope.$broadcast('displayMessage', 'Success', '<div>User Settings Saved</div>');
    })
  };

}]);