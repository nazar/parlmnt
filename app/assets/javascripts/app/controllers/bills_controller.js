angular.module('parlmntDeps').controller('billsController', ['$scope', '$filter', 'bill', function($scope, $filter, bill) {

  $scope.dataSource = bill.getBills;
  $scope.rootName = 'bills';

  mixinBillsTrait($scope, $filter, bill);  //TODO probably a better way of doing this

}]);