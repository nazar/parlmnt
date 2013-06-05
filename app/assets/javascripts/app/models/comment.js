angular.module('parlmntDeps').factory('comment', ['$http', function($http) {

  var comment = {};

  comment.getComments = function(path) {
    return $http.get(path);
  };

  comment.createComment = function(commentableType, commentableObj, comment, replyingToId) {
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

  comment.updateComment = function(commentId, commentBody) {
    var data = {
      comment: {
        body: commentBody
      }
    };

    return $http.put(Routes.comment_path(commentId), data);
  };

  comment.replyComment = function(parentCommentId, commentBody) {
    var data = {
      comment: {
        body: commentBody
      }
    };

    return $http.post(Routes.reply_comment_path(parentCommentId), data);
  };

  comment.deleteComment = function(commentId) {
    //IE8 doesn't like $http.delete
    return $http['delete'](Routes.comment_path(commentId, {method: 'delete'}));
  };

  comment.getMyVotes = function(commentableId, commentableType){
    return $http.get(Routes.my_votes_comments_path({commentable_id: commentableId, commentable_type: commentableType}))
  };

  return comment;

}]);