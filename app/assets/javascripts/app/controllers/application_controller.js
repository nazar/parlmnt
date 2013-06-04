angular.module('parlmntDeps').controller('applicationController', ['$scope', 'user', function($scope, user) {

  $scope.loggedIn = function() {
    return user.loggedIn()
  };

  $scope.setTitle = function(title) {
    $('html title').text(title);

    _trackAction(title);
  };

  $scope.userName = function() {
    return user.userName();
  };

  $scope.$on('displayMessage', function(event, title, msg) {
    $.gritter.add({
      title: title,
      text: msg,
      sticky: false,
      time: 2500
    });

  });

  $scope.setTitle('Debate Bills and Acts of Parliament');



  /////////// PRIVATE


  function _trackAction(title){
    try {
      if ( typeof window._paq !== 'undefined' ){
        window._paq.push(['setDocumentTitle', title]);
        window._paq.push(['setCustomUrl', window.location.href ]);
        window._paq.push(['trackPageView']);
      }
    } catch(e) {}
  }



}]);