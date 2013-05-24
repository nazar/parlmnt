angular.module('parlmntDeps').directive('myVotable', [function() {

  return {
    templateUrl: '/templates/common/votable.js',
    replace: true,

    scope: {
      myVotable: '=',
      votableType: '@',
      voteScore: '@',
      voteFlag: '@',
      upVerb: '@',
      downVerb: '@'
    },

    controller:  ['$scope', '$http', function($scope, $http) {
      var votable = {};

      $scope.localUp = $scope.upVerb || 'up';
      $scope.localDown = $scope.downVerb || 'down';

      $scope.voteUp = function() {
        votable.vote($scope.localUp)
          .success(_updateVotable)
      };

      $scope.voteDown = function() {
        votable.vote($scope.localDown)
          .success(_updateVotable)
      };



      //inline service
      votable.vote = function(direction) {
        var data = {
          vote: {
            votable_type: $scope.votableType,
            votable_id: $scope.myVotable.id,
            vote_flag: direction
          }
        };

        return $http.post(Routes.votes_path(), data);
      };


      /// private

      function _updateVotable(res) {
        Object.merge($scope.myVotable, res);
      }

    }]
  }


}]);