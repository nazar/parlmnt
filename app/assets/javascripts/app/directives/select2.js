angular.module('parlmntDeps').directive('select2', ['$timeout', 'user',  function($timeout, user) {

  return {

    link: function(scope, element, atts) {
      $timeout(function() {
        element.select2();
        if (user.constituencyId()) {
          element.select2().select2('val', user.constituencyId());
        }
      });
    }
  }

}]);