angular.module('parlmntDeps').controller('actsController', ['$scope', '$filter', 'bill', function($scope, $filter, bill) {

  $scope.dataSource = bill.getActs;
  $scope.rootName = 'acts';

  $scope.setTitle('Viewing Acts for 2013');

  mixinBillsTrait($scope, $filter, bill);   //TODO probably a better way of doing this

}]);