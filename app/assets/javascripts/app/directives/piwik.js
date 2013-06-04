angular.module('parlmntDeps').directive('piwik', ['$timeout', 'user',  function($timeout, user) {

  return {
    controller: ['$scope', function($scope) {

      $scope.trackPageView = function(title){
        try {
          if(typeof(piwikTracker) != 'undefined') {
            piwikTracker.setCustomUrl(window.location.href);
            piwikTracker.trackPageView(title);
          }
        } catch(e) {}
      };

      $scope.trackFilterAction = function(action, option){
        try {
          if(typeof(piwikTracker) != 'undefined') {
            piwikTracker.setCustomVariable(1, 'trackFilterAction', '{action} : {option}'.assign({action: action, option: option}), 'page');
            piwikTracker.trackLink();
          }
        } catch(e) {}
      }
    }]

  }

}]);