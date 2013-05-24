angular.module('parlmntDeps').factory('message', ['$rootScope', function($rootScope) {

  var messageFactory = {};

  messageFactory.setMessage = function(title, message, type) {
    var message = {
      title: title,
      message: message,
      type: type || 'warning'
    };

    $rootScope.$broadcast('displayMessage', message);
  };

  return messageFactory;

}]);