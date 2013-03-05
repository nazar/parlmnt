define([
  'sandbox',

  'widgets/commentable/views/commentable',

  'widgets/votable/main',

], function (sandbox, CommentableView, votableWidget) {

  return function (options) {
    var commentableView;

    commentableView = new CommentableView(
      Object.merge(options, {
        votableBuilder: votableWidget //set here or during invocation??? hmm....
      }, false, false)
    );


    return commentableView;
  };

});