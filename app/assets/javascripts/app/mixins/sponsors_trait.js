function mixinSponsorsTrait($scope, $filter, sponsor) {

  $scope.sponsors = [];

  $scope.sponsorMap = {};
  $scope.loading = true;

  $scope.orderByFilter = 'name';
  $scope.filters = {};
  $scope.customFilters = {};
  $scope.nameFilter = '';
  $scope.constituencyFilter = '';


  $scope.getSponsors = function() {
    $scope.setTitle('Viewing {type}'.assign({type: $scope.rootName.capitalize()}));
    _loading(true);
    $scope.dataSource()
      .success(function(data) {
        _setSponsors(data[$scope.rootName]);
        _updateMyVotes();
        _loading(false);
      });
  };

  $scope.dataSource()
    .success(function(data) {
      _setSponsors(data[$scope.rootName]);
      _updateMyVotes();
      _loading(false);
    });



  // FILTERING

  $scope.filteredSponsors = function() {
    var filteredSponsors;

    function nameMatcher(sponsor) {
      return sponsor.name.toLowerCase().has($scope.nameFilter) || sponsor.constituency.toLowerCase().has($scope.nameFilter);
    }

    filteredSponsors = Object.keys($scope.filters).length > 0 ? $filter('filter')($scope.sponsors, $scope.filters) : $scope.sponsors;

    //name search
    if ($scope.nameFilter) {
      filteredSponsors = $filter('filter')(filteredSponsors, nameMatcher)
    }
    //custom function filters
    Object.each($scope.customFilters, function(filter, fn) {
      filteredSponsors = fn.call(filteredSponsors);
    });

    return $filter('orderBy')(filteredSponsors, $scope.orderByFilter);
  };

  $scope.setOrder = function(order){
    $scope.orderByFilter = order;
  };

  $scope.showByParty = function(party) {
    _setFilter('party_short_name', party);
  };

  $scope.showOnlySponsored = function(fact) {
    _setCustomFilter('count_bills', fact, function() {
      return this.filter(function(sponsor) {
        return sponsor.count_bills > 0;
      })
    })
  };



  //// TEH Private

  function _setSponsors(sponsors) {
    _resetSponsorMap();

    $scope.sponsors = null;
    $scope.sponsors = sponsors;
    $scope.sponsors.each(function(sponsor) {
      $scope.sponsorMap[sponsor.id] = sponsor;
    });

  }

  function _updateMyVotes() {
    sponsor.getMyVotes()
      .success(function(response) {
        response.votes.each(function(vote) {
          if ($scope.sponsorMap[vote.votable_id]) {
            $scope.sponsorMap[vote.votable_id].voted = vote.vote_flag_to_s;
          }
        });
      });
  }

  function _resetSponsorMap() {
    $scope.sponsorMap = null;
    $scope.sponsorMap = {};
  }

  function _loading(fact) {
    $scope.loading = fact;
  }

  function _setFilter(filterName, filter) {
    if (filter === 'all') {
      delete $scope.filters[filterName];
    } else {
      $scope.filters[filterName] = filter;
    }
  }

  function _setCustomFilter(filterName, filter, fn) {
    if (filter === 'all') {
      delete $scope.customFilters[filterName];
    } else {
      $scope.customFilters[filterName] = fn;
    }
  }



}