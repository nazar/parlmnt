angular.module('parlmntDeps').directive('formModal', ['$compile', '$http', function($compile, $http) {

  return {
    scope: {
      formObject: '=',
      formErrors: '=',
      title: '@',
      template: '@',
      okButtonText: '@',
      formSubmit: '&',
      formClear: '&'
    },
    compile: function(element, cAtts){
      var template,
          $element,
          loader;

      loader = $http.get('/templates/common/form_modal.js')
          .success(function(data) {
            template = data;
          });

      return function(scope, element, lAtts) {

        loader.then(function() {
          $element = $( $compile(template)(scope) );
        });

        scope.submit = function() {
          var result = scope.formSubmit();

          if (Object.isObject(result)) {
            result.success(function() {
              $element.modal('hide');
            });
          } else if (result === false) {
            //noop
          } else {
            $element.modal('hide');
          }
        };

        scope.close = function() {
          $element.modal('hide');
          scope.formClear();
        };

        element.on('click', function(e) {
          e.preventDefault();
          $element.modal('show');
        });
      };
    }
  }


}]);