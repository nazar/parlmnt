angular.module('parlmntDeps').directive('confirmDeleteComment', [function() {

  return {
    replace: true,
    template: '<a href="#" ok-cancel-modal template="/templates/commentable/confirm_delete.html" title="Confirm Deletion" ok-button-text="Delete" on-ok="deleteComment(comment)">delete</a>'
  }

}]);