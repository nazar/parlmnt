angular.module('parlmntDeps').controller('sponsorController',
['$scope', '$routeParams', 'sponsor',
function($scope,   $routeParams,   sponsor) {

  $scope.sponsor = {};

  sponsor.getSponsor($routeParams.sponsorId)
    .success(function(data) {
      _setSponsor(data.sponsor);
      $scope.sponsorCommentsPath = Routes.comments_mp_path($scope.sponsor.id);
    });


  // Render helpers

  $scope.countComments = function(counter) {
    counter = counter || 0;
    return counter.toString() +' '+(counter === 1 ? 'Comment' : 'Comments')
  };

  $scope.sponsorToClass = function(sponsor) {
    if (sponsor.party) {
      return 's-{party}'.assign({party: sponsor.party.name.toLowerCase().dasherize()})
    } else {
      return '';
    }
  };

  // bills

  $scope.sponsorBills = function() {
    return $scope.sponsor.bills;
  };


  /// PRIVATE

  function _setSponsor(sponsor_detail) {
    $scope.sponsor = null;
    $scope.sponsor = sponsor_detail;
  }

}]);