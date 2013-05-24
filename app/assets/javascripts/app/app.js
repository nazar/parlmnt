angular.module('parlmnt', ['parlmntDeps']);
angular.module('parlmntDeps', []);


angular.module('parlmntDeps').config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/',                    {templateUrl: '/templates/pages/landing.html',     controller: 'applicationController'}).
      when('/bills',               {templateUrl: '/templates/bills/index.html',       controller: 'billsController'}).
      when('/acts',                {templateUrl: '/templates/bills/index.html',       controller: 'actsController'}).
      when('/bills/:billId',       {templateUrl: '/templates/bills/show.html',        controller: 'billController'}).
      when('/mps',                 {templateUrl: '/templates/sponsors/index.html',    controller: 'mpsController'}).
      when('/lords',               {templateUrl: '/templates/sponsors/index.html',    controller: 'lordsController'}).
      when('/sponsors/:sponsorId', {templateUrl: '/templates/sponsors/show.html' ,    controller: 'sponsorController'}).
      when('/api',                 {templateUrl: '/templates/pages/api.html' ,        controller: 'applicationController'}).

      otherwise({redirectTo: '/'});
}]);