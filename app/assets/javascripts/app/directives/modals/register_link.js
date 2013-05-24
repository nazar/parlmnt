angular.module('parlmntDeps').directive('registerLink', [function() {

  return {
    replace: true,
    template: '<a href="#" form-modal template="/templates/sessions/register.js" title="Register" ok-button-text="Register" form-submit="register()" form-clear="clear()" form-object="formUser" form-errors="errors">Register</a>'
  }

}]);