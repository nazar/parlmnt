angular.module('parlmntDeps').controller('searchController', ['$scope', '$http', function($scope, $http) {

  $scope.searchBox = '';

  $scope.search = function() {
    if ($scope.searchBox) {
      $http.post(Routes.search_path(), {term: $scope.searchBox})
        .success(_showSearchResult)
    }
  };


  //// PRIVATE

  function _showSearchResult(res) {

    var groupToName = {
      mps: 'MPs',
      lords: 'Lords',
      bills: 'Bills and Acts'
    };

    var groupToPath = {
      mps: '#/sponsors/{id}',
      lords: '#/sponsors/{id}',
      bills: '#/bills/{id}'
    };

    var $search = $('<div></div>');

    var $form = $('#search');

    Object.each(res, function(searchGroup, results) {
      var $result = $('<ul><li class="header">{heading}</li></ul>'.assign({heading: groupToName[searchGroup]}));

      results.each(function(search) {
        var li = '<li class="search-result"><a href="{path}">{name}</a></li>'.assign({
          path: groupToPath[searchGroup].assign({id: search.id}),
          name: search.name
        });
        $result.append(li)
      });

      $search.append($result);
    });

    $form.popover({
      html: true,
      placement: 'bottom',
      trigger: 'manual',
      title: 'Search Results',
      content: $search.html(),
      container: '#search'
    });

    $form.popover('show');

    //add a page listener to close menu on mouse click
    $('html').one('click', function(e) {
      e.preventDefault();
      $form.popover('destroy');
    });

  }

}]);