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
    return $http.post('/register.json', {user: user})
      .success(_loadSession);
  };

  userFactory.login = function(user) {
    return $http.post('/login.json', {user: user})
      .success(_loadSession);
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