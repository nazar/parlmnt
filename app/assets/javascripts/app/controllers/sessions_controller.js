angular.module('parlmntDeps').controller('sessionsController', ['$scope', 'user',  function($scope, user) {

  $scope.formUser = {};
  $scope.errors = {};

  user.getUser();


  $scope.register = function() {
    _clearErrors();

    if ($scope.formUser.password !== $scope.formUser.password_confirmation) {
      _addError('password', 'Password mismatch');
      _addError('password_confirmation', 'Password mismatch');
    }
    if ($scope.formUser.username.length < 3) {
      _addError('username', 'Too short');
    }
    if ($scope.formUser.password.length < 6) {
      _addError('password', 'Too short. Minimum of six characters');
    }

    if (Object.keys($scope.errors).length === 0) {
      return user.register($scope.formUser)
        .error(_errored);
    } else {
      return false;
    }
  };

  $scope.login = function() {
    _clearErrors();
    return user.login($scope.formUser)
      .error(_errored);
  };

  $scope.logout = function() {
    return user.logout();
  };

  $scope.userName = function() {
    return user.userName();
  };

  $scope.clear = function() {
    _clearUser();
    _clearErrors();
  };


  ///// PRIVATE

  function _clearErrors(){
    $scope.errors = null;
    $scope.errors = {};
  }

  function _clearUser(){
    $scope.formUser = null;
    $scope.formUser = {};
  }

  function _addError(field, message) {
    $scope.errors[field] = message;
  }

  function _errored(response) {
    if (response.errors) {
      Object.each(response.errors, function(field, errors) {
        _addError(field, errors.first())
      });

      if ($scope.errors.ip) {
        _addError('extra', $scope.errors.ip)
      }

      if (response.errors.base && Object.isString(response.errors.base)) {
        _addError('extra', response.errors.base)
      }
    }
  }

}]);


