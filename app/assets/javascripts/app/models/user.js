angular.module('parlmntDeps').factory('user', ['$http', function($http) {

  var userFactory = {};

  var userObj = {
    username: null,
    loggedIn: false
  };

  userFactory.getUser = function() {
    return _loadUser().then(function() {
      return userObj;
    })
  };

  userFactory.loggedIn = function() {
    return userObj.loggedIn;
  };

  userFactory.userName = function() {
    return userObj.username;
  };

  userFactory.register = function(user) {
    return $http.post(Routes.register_path(), {user: user})
      .success(_loadSession);
  };

  userFactory.login = function(user) {
    return $http.post(Routes.login_path(), {user: user})
      .success(_loadSession);
  };

  userFactory.logout = function() {
    return $http.post(Routes.logout_path())
      .success(function() {
        userObj.username = null;
        userObj.loggedIn = false;
      });
  };


  ///////////////

  function _loadUser() {
    return $http.get('/me.json')
      .success(_loadSession);
  }

  function _loadSession(response) {
    if (response.user && response.user.username) {
      userObj.loggedIn = true;
      userObj.username = response.user.username;
    }
  }


  return userFactory;

}]);