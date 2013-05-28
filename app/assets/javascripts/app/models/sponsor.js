angular.module('parlmntDeps').factory('sponsor', ['$http', function($http) {

  var sponsorFactory = {};

  sponsorFactory.getMps = function(year) {
    return $http.get(Routes.mps_path());
  };

  sponsorFactory.getLords = function(year) {
    return $http.get(Routes.lords_path());
  };

  sponsorFactory.getSponsor = function(id) {
    return $http.get(Routes.sponsor_path(id));
  };

  sponsorFactory.getMyVotes = function() {
    return $http.get(Routes.my_votes_sponsors_path());
  };


  return sponsorFactory;

}]);