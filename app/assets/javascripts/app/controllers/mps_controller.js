angular.module('parlmntDeps').controller('mpsController', ['$scope', '$filter', 'sponsor', function($scope, $filter, sponsor) {

  $scope.dataSource = sponsor.getMps;
  $scope.rootName = 'mps';

  mixinSponsorsTrait($scope, $filter, sponsor);   //TODO probably a better way of doing this


}]);