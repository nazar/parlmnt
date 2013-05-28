angular.module('parlmntDeps').factory('user', ['$http', function($http) {

  var userFactory = {};

  var userObj = {
    name: null,
    constituency_id: null,
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

  userFactory.constituencyId = function() {
    return userObj.constituency_id;
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

  userFactory.update = function(obj) {
    return $http.put(Routes.user_path(), {user: obj});
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
      userObj.name = response.user.name;
      userObj.email = response.user.email;
      userObj.constituency_id = response.user.constituency_id;
    }
  }


  return userFactory;

}]);