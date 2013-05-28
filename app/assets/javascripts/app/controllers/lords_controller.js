angular.module('parlmntDeps').controller('lordsController', ['$scope', '$filter', 'sponsor', function($scope, $filter, sponsor) {

  $scope.dataSource = sponsor.getLords;
  $scope.rootName = 'lords';

  $scope.setTitle('Viewing Lords');

  mixinSponsorsTrait($scope, $filter, sponsor);   //TODO probably a better way of doing this


}]);