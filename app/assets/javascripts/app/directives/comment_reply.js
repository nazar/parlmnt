angular.module('parlmntDeps').directive('commentReply', ['$http', '$compile', function($http, $compile) {

  return {
    scope: {
      target: '@',
      template: '@',
      actionReply: '&'
    },

    compile: function(element, atts){
      var template;

      $http.get('/templates/commentable/reply.js')
        .success(function(data) {
          template = data;
        });

      return function(scope, element, atts) {
        var $element,
          $replyContainer;


        //ng-click hooks defined on reply template
        scope.cancel = function() {
          $element.remove();
        };

        scope.save = function() {
          scope.actionReply();
        };

        element.on('click', function(e) {
          e.preventDefault();

          $replyContainer = $(element.closest('.comment-container').find(scope.target));
          $element = $( $compile(template)(scope) );

          $replyContainer.append($element)
        })

      }
    }
  }

}]);