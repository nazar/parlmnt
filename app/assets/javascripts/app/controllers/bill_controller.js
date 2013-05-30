angular.module('parlmntDeps').controller('billController',
       ['$scope', '$routeParams', 'bill',
function($scope,   $routeParams,   bill) {

  $scope.bill = {};
  $scope.billCommentsPath = '';

  bill.getBill($routeParams.billId)
    .success(function(data) {
      _setBill(data.bill_detail);
      $scope.setTitle('Viewing ' + $scope.bill.name);
      $scope.billCommentsPath = Routes.comments_bill_path($scope.bill.id);
    });


  // Render helpers

  $scope.countComments = function(counter) {
    counter = counter || 0;
    return counter.toString() +' '+(counter === 1 ? 'Comment' : 'Comments')
  };

  $scope.billOrigin = function(billOrigin) {
    return bill.billOrigins(billOrigin)
  };

  $scope.billType = function(billType) {
    return bill.billTypes(billType);
  };

  $scope.billStage = function(currentStage) {
    if (currentStage) {
      return currentStage.stage;
    } else {
      return 'None';
    }
  };

  $scope.sponsorToClass = function(sponsor) {
    if (sponsor.party) {
      return 's-{party}'.assign({party: sponsor.party.name.toLowerCase().dasherize()})
    } else {
      return '';
    }
  };

  $scope.daysAgo = function(date) {
    return Date.create(date).relative();
  };

  // stages

  $scope.billStages = function() {
    return $scope.bill.bill_stages;
  };

  // documents

  $scope.billDocuments = function() {
    return $scope.bill.bill_documents;
  };


  /// PRIVATE


  function _setBill(bill_details) {
    $scope.bill = null;
    $scope.bill = bill_details;
  }

}]);