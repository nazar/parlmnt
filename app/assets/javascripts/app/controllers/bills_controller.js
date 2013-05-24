angular.module('parlmntDeps').controller('billsController', ['$scope', '$filter', 'bill', function($scope, $filter, bill) {

  $scope.dataSource = bill.getBills;
  $scope.rootName = 'bills';

  $scope.setTitle('Viewing Bills for 2013');

  mixinBillsTrait($scope, $filter, bill);  //TODO probably a better way of doing this

}]);