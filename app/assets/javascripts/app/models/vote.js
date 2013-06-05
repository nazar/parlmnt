angular.module('parlmntDeps').factory('vote', ['$http', function($http) {

  var vote = {};

  vote.vote = function(voteableType, voteableId, direction) {
    var data = {
      vote: {
        voteable_type: voteableType,
        voteable_id: voteableId,
        vote_flag: direction
      }
    };

    return $http.post(Routes.votes_path(), data);
  };
  return vote;

}]);