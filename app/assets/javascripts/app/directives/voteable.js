angular.module('parlmntDeps').directive('voteable', ['$rootScope', 'user', 'vote', function($rootScope, user, vote) {

  return {

    controller:  ['$scope', '$attrs', '$http', function($scope, $attrs, $http) {

      $scope.voteUp = function(voteObj) {
        _canVote(function() {
          vote.vote($attrs.voteableType, voteObj.id, 'up')
            .success(function(res){
              Object.merge(voteObj, res);
            });
        });
      };

      $scope.voteDown = function(voteObj) {
        _canVote(function() {
          vote.vote($attrs.voteableType, voteObj.id, 'down')
            .success(function(res){
              Object.merge(voteObj, res);
            });
        });
      };


      /// private


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