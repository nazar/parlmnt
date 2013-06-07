angular.module('parlmntDeps').directive('navbar', ['$timeout', 'user',  function($timeout, user) {

  return {
    controller: ['$scope', '$location', function($scope, $location) {

      $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || 'home';

        return page === currentRoute.split('/').first() ? 'active' : '';
      };

    }]

  }

}]);