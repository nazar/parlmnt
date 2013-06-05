angular.module('parlmntDeps').directive('commentable', ['comment', function(comment) {

  return {

    templateUrl: '/templates/commentable/commentable',

    scope: {
      src: '=',
      commentable: '=',
      commentableType: '@',
      loggedIn: '&'
    },

    controller: ['$scope', '$http', function($scope, $http) {

      $scope.comments = [];
      $scope.formComment = {};
      $scope.commentMap = {};

      $scope.$watch('src', function(path) {
        if (path) {
          comment.getComments($scope.src)
            .success(function(res){
              _setComments(res);
              _updateMyVotes();
            });
        }
      });

      $scope.commentEdit = function(commentObj) {
        commentObj.interact = commentObj.body;
        commentObj.editing = true;
        commentObj.replying = false;
      };

      $scope.commentReply = function(commentObj) {
        commentObj.interact = '';
        commentObj.replying = true;
        commentObj.editing = false;
      };

      $scope.cancelComment = function(commentObj) {
        _commentResetState(commentObj);
      };

      $scope.createComment = function() {
        if ($scope.formComment.body) {
          comment.createComment($scope.commentableType, $scope.commentable, $scope.formComment.body)
            .success(function(reponse) {
              _resetFormComment();
              $scope.comments.push(Object.merge(reponse.comment, {voted: 'up'}))
            })
        }
      };

      $scope.updateComment = function(commentObj) {
        comment.updateComment(commentObj.id, commentObj.interact)
          .success(function(response) {
            _commentResetState(commentObj);
            Object.merge(commentObj, response.comment);
          });
      };

      $scope.replyComment = function(commentObj) {
        comment.replyComment(commentObj.id, commentObj.interact)
          .success(function(response) {
            _commentResetState(commentObj);
            commentObj.children.push(Object.merge({replying: false, editing: false, interact: '', voted: 'up'}, response.comment));
          });
      };

      $scope.deleteComment = function(commentObj) {
        comment.deleteComment(commentObj.id)
          .success(function() {
            $scope.comments.remove(commentObj);
          });
      };

      $scope.score = function(commentObj){
        return parseFloat(commentObj.score) * -1;
      };


      /// PRIVATE

      //helpers
      function _resetFormComment() {
        $scope.formComment = null;
        $scope.formComment = {};
      }

      function _commentResetState(commentObj) {
        commentObj.replying = false;
        commentObj.editing = false;
      }

      function _setComments(res) {
        $scope.comments = null;
        $scope.commentMap = null;
        $scope.commentMap = {};

        $scope.comments = res.comments;
        _mapComments($scope.comments);

      }

      function _updateMyVotes() {
        comment.getMyVotes($scope.commentable.id, $scope.commentableType)
          .success(function(response) {
            response.votes.each(function(vote) {
              if ($scope.commentMap[vote.votable_id]) {
                $scope.commentMap[vote.votable_id].voted = vote.vote_flag_to_s;
              }
            });
          });
      }

      function _mapComments(comments) {
        comments.each(function(comment){
          $scope.commentMap[comment.id] = comment;
          if (comment.children.length > 0) {
            _mapComments(comment.children)
          }
        });

      }

    }]
  };


}]);