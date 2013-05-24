angular.module('parlmntDeps').directive('okCancelModal', ['$compile', '$http', function($compile, $http) {

  return {
    scope: {
      title: '@',
      template: '@',
      okButtonText: '@',
      onOk: '&',
      onCancel: '&'
    },
    compile: function(element, cAtts){
      var template,
          $element,
          loader;

      loader = $http.get('/templates/common/oc_modal.js')
        .success(function(data) {
          template = data;
        });

      return function(scope, element, lAtts) {
        scope.save = function() {
          if (scope.onOk() !== false) {
            $element.modal('hide')
          }
        };

        scope.close = function() {
          if (scope.onCancel() !== false) {
            $element.modal('hide')
          }
        };


        loader.then(function() {
          $element = $( $compile(template)(scope) );

          element.on('click', function(e) {
            e.preventDefault();
            $element.modal('show');
          });
        });
      };
    }
  }


}]);