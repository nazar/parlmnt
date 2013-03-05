define([
  'sandbox'
], function (sandbox) {


  var CommentModel = sandbox.mvc.Model({

    urlRoot: '/comments',

    defaults: {
      "children": []
    }


   },{



    /// CLASS METHODS

    addReply: function(parentComment, newBody) {
      var newComment;

      newComment = new CommentModel({
        body: newBody,
        commentable_id: parentComment.get('commentable_id'),
        commentable_type: parentComment.get('commentable_type'),
        parent_id: parentComment.get('id')
      });

      return newComment.save()
        .then(function(newCommentJson) {
          parentComment.set('children', parentComment.get('children').include(newCommentJson));
          return newCommentJson;
        });
    },

    addNewCommentFromView: function(commentableView, body) {
      var comment;

      comment = new CommentModel({
        body: body,
        commentable_id: commentableView.commentable_id,
        commentable_type: commentableView.commentable_type
      });

      return comment.save();
    }
  });

  return CommentModel;

});