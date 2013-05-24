angular.module('parlmntDeps').directive('loginLink', [function() {

  return {
    replace: true,
    template: '<a href="#" form-modal template="/templates/sessions/login.js" title="Login" ok-button-text="Login" form-submit="login()" form-clear="clear()" form-object="formUser" form-errors="errors">Login</a>'
  }

}]);