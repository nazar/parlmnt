angular.module('parlmntDeps').directive('textTruncator', ['$timeout',  function($timeout) {

  return {

    link: function(scope, element, atts) {
      if (scope.$last) {

        scope.$on('$includeContentLoaded', function(event) {
          $timeout(function() {
            $(atts.truncSelector).truncate({
              max_length: atts.truncMaxLength || '100'
            })
          });
        });

      }
    }
  }

}]);