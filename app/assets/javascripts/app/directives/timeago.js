angular.module('parlmntDeps').directive('timeago', ['$timeout',  function($timeout) {

  return {

    link: function(scope, element, atts) {
      if (scope.$last) {
        scope.$on('$includeContentLoaded', function(event) {
          $timeout(function() {
            $(atts.timeSelector).timeago()
          });
        });
      }
    }
  }

}]);