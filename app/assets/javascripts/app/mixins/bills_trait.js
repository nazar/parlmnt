function mixinBillsTrait($scope, $filter, bill) {

  $scope.bills = [];

  $scope.billMap = {};
  $scope.loading = true;

  $scope.orderByFilter = 'name';
  $scope.filters = {};
  $scope.customFilters = {};


  $scope.dataSource('2013')
    .success(function(data) {
      _setBills(data[$scope.rootName]);
      _updateMyVotes();
      _loading(false);
    });


  $scope.getYear = function(year) {
    $scope.setTitle('Viewing {type} for {year}'.assign({type: $scope.rootName.capitalize(), year: year}));
    _loading(true);
    $scope.dataSource(year)
      .success(function(data) {
        _setBills(data[$scope.rootName]);
        _updateMyVotes();
        _loading(false);
      });
  };





  // FILTERING

  $scope.filteredBills = function() {
    var filteredBills;

    filteredBills = Object.keys($scope.filters).length > 0 ? $filter('filter')($scope.bills, $scope.filters) : $scope.bills;
    //custom function filters
    Object.each($scope.customFilters, function(filter, fn) {
      filteredBills = fn.call(filteredBills);
    });

    return $filter('orderBy')(filteredBills, $scope.orderByFilter);
  };

  $scope.setOrder = function(order){
    $scope.orderByFilter = order;
  };

  $scope.showBillType = function(type) {
    _setFilter('bill_type', type);
  };

  $scope.showBillOrigin = function(origin) {
    _setFilter('origin', origin);
  };

  $scope.showBillStage = function(stage) {
    _setFilter('current_stage_code', stage);
  };

  $scope.showBillParty = function(partyShort) {
    _setCustomFilter('billParty', partyShort, function() {
      return this.filter(function(b) {
        return b.sponsors.find(function(s) {
          return s.party ? s.party.short == partyShort : false;
        })
      })
    });
  };

  // Render helpers

  $scope.countComments = function(counter) {
    counter = counter || 0;
    return counter.toString() +' '+(counter === 1 ? 'Comment' : 'Comments')
  };

  $scope.billOrigin = function(billOrigin) {
    return bill.billOrigins(billOrigin)
  };

  $scope.billType = function(billType) {
    return bill.billTypes(billType);
  };

  $scope.billStage = function(currentStage) {
    if (currentStage) {
      return currentStage.stage;
    } else {
      return 'None';
    }
  };

  $scope.strippedSummary = function(bill){
    if (bill.summary) {
      return bill.summary.stripTags();
    } else {
      return '';
    }
  };


  //// TEH Private

  function _setBills(bills) {
    _resetBillMap();

    $scope.bills = null;
    $scope.bills = bills;
    $scope.bills.each(function(bill) {
      $scope.billMap[bill.id] = bill;
    });

  }

  function _updateMyVotes() {
    bill.getMyVotes()
      .success(function(response) {
        response.votes.each(function(vote) {
          if ($scope.billMap[vote.votable_id]) {
            $scope.billMap[vote.votable_id].voted = vote.vote_flag_to_s;
          }
        });
      });
  }

  function _resetBillMap() {
    $scope.billMap = null;
    $scope.billMap = {};
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

  function _loading(fact) {
    $scope.loading = fact;
  }

}