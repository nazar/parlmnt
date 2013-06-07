angular.module('parlmntDeps').controller('chartsController', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {

  $scope.chart = '';


  (function() {
    $scope.chart = $routeParams.chart || 'bills';
  })();


  $scope.navClass = function (page) {
    var currentRoute = $location.path().split('/'),
      route = currentRoute.length > 2 ? currentRoute.last() : 'bills';

    return page === route ? 'active' : '';
  };





}]);