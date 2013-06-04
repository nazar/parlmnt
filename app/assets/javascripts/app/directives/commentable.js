angular.module('parlmntDeps').directive('commentable', [function() {

  return {

    templateUrl: '/templates/commentable/commentable',

    scope: {
      src: '=',
      commentable: '=',
      commentableType: '@',
      loggedIn: '&'
    },

    controller: ['$scope', '$http', function($scope, $http) {
      var commentable = {};

      $scope.comments = [];
      $scope.formComment = {};
      $scope.commentMap = {};

      $scope.$watch('src', function(path) {
        if (path) {
          commentable.getComments($scope.src)
            .success(function(res){
              _setComments(res);
              _updateMyVotes();
            });
        }
      });

      $scope.commentEdit = function(comment) {
        comment.interact = comment.body;
        comment.editing = true;
        comment.replying = false;
      };

      $scope.commentReply = function(comment) {
        comment.interact = '';
        comment.replying = true;
        comment.editing = false;
      };

      $scope.cancelComment = function(comment) {
        _commentResetState(comment);
      };

      $scope.createComment = function() {
        if ($scope.formComment.body) {
          commentable.createComment($scope.commentableType, $scope.commentable, $scope.formComment.body)
            .success(function(reponse) {
              _resetFormComment();
              $scope.comments.push(Object.merge(reponse.comment, {voted: 'up'}))
            })
        }
      };

      $scope.updateComment = function(comment) {
        commentable.updateComment(comment.id, comment.interact)
          .success(function(response) {
            _commentResetState(comment);
            Object.merge(comment, response.comment);
          });
      };

      $scope.replyComment = function(comment) {
        commentable.replyComment(comment.id, comment.interact)
          .success(function(response) {
            _commentResetState(comment);
            comment.children.push(Object.merge({replying: false, editing: false, interact: '', voted: 'up'}, response.comment));
          });
      };

      $scope.deleteComment = function(comment) {
        commentable.deleteComment(comment.id)
          .success(function() {
            _commentResetState(comment);
            $scope.comments.remove(comment);
          });
      };

      $scope.score = function(comment){
        return parseFloat(comment.score) * -1;
      };

      //inline Commentable service

      commentable.getComments = function(path) {
        return $http.get(path);
      };

      commentable.createComment = function(commentableType, commentableObj, comment, replyingToId) {
        var data = {
          comment: {
            commentable_type: commentableType,
            commentable_id: commentableObj.id,
            parent_id: replyingToId,
            body: comment
          }
        };

        return $http.post(Routes.comments_path(), data);
      };

      commentable.updateComment = function(commentId, commentBody) {
        var data = {
          comment: {
            body: commentBody
          }
        };

        return $http.put(Routes.comment_path(commentId), data);
      };

      commentable.replyComment = function(parentCommentId, commentBody) {
        var data = {
          comment: {
            body: commentBody
          }
        };

        return $http.post(Routes.reply_comment_path(parentCommentId), data);
      };

      commentable.deleteComment = function(commentId) {
        return $http.delete(Routes.comment_path(commentId, {method: 'delete'}));
      };
      
      commentable.getMyVotes = function(commentableId, commentableType){
        return $http.get(Routes.my_votes_comments_path({commentable_id: commentableId, commentable_type: commentableType}))
      };


      /// PRIVATE

      //helpers
      function _resetFormComment() {
        $scope.formComment = null;
        $scope.formComment = {};
      }

      function _commentResetState(comment) {
        comment.replying = false;
        comment.editing = false;
      }

      function _setComments(res) {
        $scope.comments = null;
        $scope.commentMap = null;
        $scope.commentMap = {};

        $scope.comments = res.comments;
        _mapComments($scope.comments);

      }

      function _updateMyVotes() {
        commentable.getMyVotes($scope.commentable.id, $scope.commentableType)
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