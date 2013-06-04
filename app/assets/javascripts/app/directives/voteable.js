angular.module('parlmntDeps').directive('voteable', ['$rootScope', 'user', function($rootScope, user) {

  return {

    controller:  ['$scope', '$attrs', '$http', function($scope, $attrs, $http) {
      var voteable = {};

      $scope.voteUp = function(voteObj) {
        _canVote(function() {
          voteable.vote($attrs.voteableType, voteObj.id, 'up')
            .success(function(res){
              Object.merge(voteObj, res);
            });
        });
      };

      $scope.voteDown = function(voteObj) {
        _canVote(function() {
          voteable.vote($attrs.voteableType, voteObj.id, 'down')
            .success(function(res){
              Object.merge(voteObj, res);
            });
        });
      };


      /// private


      voteable.vote = function(voteableType, voteableId, direction) {
        var data = {
          vote: {
            voteable_type: voteableType,
            voteable_id: voteableId,
            vote_flag: direction
          }
        };

        return $http.post(Routes.votes_path(), data);
      };


      function _canVote(fn) {
        if (user.loggedIn()) {
          fn();
        } else {
          $rootScope.$broadcast('displayMessage', 'Not logged in', '<div>please Register or Login to Vote and Comment.</div>');
        }
      }

    }]
  }


}]);