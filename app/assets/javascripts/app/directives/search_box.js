angular.module('parlmntDeps').directive('searchBox', [function() {

  return {

    templateUrl: '/templates/common/search',
    scope: {},

    controller: ['$scope', '$element', '$http', function($scope, $element, $http) {
      $scope.searchBox = '';

      $scope.search = function() {
        if ($scope.searchBox) {
          $http.post(Routes.search_path(), {term: $scope.searchBox})
            .success(_showSearchResult)
        }
      };


      //// PRIVATE

      function _showSearchResult(res) {
        var groupToName,
          groupToPath,
          $search;

        groupToName = {
          mps: 'MPs',
          lords: 'Lords',
          bills: 'Bills and Acts',
          constituencies: 'Constituencies'
        };

        groupToPath = {
          mps: '#/sponsors/{id}',
          lords: '#/sponsors/{id}',
          bills: '#/bills/{id}',
          constituencies: '#/sponsors/{id}'
        };

        $search = $('<div></div>');

        Object.each(res, function(searchGroup, results) {
          var $result;

          if (results.length > 0) {
            $result = $('<ul><li class="header">{heading}</li></ul>'.assign({heading: groupToName[searchGroup]}));

            results.each(function(search) {
              var li = '<li class="search-result"><a href="{path}">{name}</a></li>'.assign({
                path: groupToPath[searchGroup].assign({id: search.id}),
                name: search.name
              });
              $result.append(li)
            });

            $search.append($result);
          }
        });

        $element.popover({
          html: true,
          placement: 'bottom',
          trigger: 'manual',
          title: 'Search Results',
          content: $search.html(),
          container: $element
        });

        $element.popover('show');

        //add a page listener to close menu on mouse click
        $('html').one('click', function(e) {
          e.preventDefault();
          $element.popover('destroy');
          $scope.searchBox = '';
        });

      }


    }]
  };


}]);