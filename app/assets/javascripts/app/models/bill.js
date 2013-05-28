angular.module('parlmntDeps').factory('bill', ['$http', function($http) {

  var bill = {};

  var _billOrigins = {
    "1": 'Commons',
    "2": 'Lords'
  };

  var _billTypes = {
    "1": 'Public',
    "2": 'Private',
    "3": 'Private Members',
    "4": 'Hybrid'
  };

  bill.getBills = function(year) {
    return $http.get(Routes.bills_path({year: year}));
  };

  bill.getActs = function(year) {
    return $http.get(Routes.acts_path({year: year}));
  };

  bill.getBill = function(id) {
    return $http.get(Routes.bill_path(id));
  };

  bill.getMyVotes = function() {
    return $http.get(Routes.my_votes_bills_path());
  };

  //types too strings

  bill.billOrigins = function(origin) {
    return _billOrigins[origin];
  };

  bill.billTypes = function(type) {
    return _billTypes[type];
  };
  
  return bill;

}]);