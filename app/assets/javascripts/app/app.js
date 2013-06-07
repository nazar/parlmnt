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
      when('/charts',              {templateUrl: '/templates/charts/index.html',      controller: 'chartsController'}).
      when('/charts/:chart',       {templateUrl: '/templates/charts/index.html',      controller: 'chartsController'}).
      when('/sponsors/:sponsorId', {templateUrl: '/templates/sponsors/show.html' ,    controller: 'sponsorController'}).
      when('/api',                 {templateUrl: '/templates/pages/api.html' ,        controller: 'applicationController'}).
      when('/my/settings',         {templateUrl: '/templates/users/settings.html' ,   controller: 'userSettingsController'}).

      otherwise({redirectTo: '/'});
}]);