define([
  'sandbox',

  'widgets/search/views/search_bar'
],

  function (sandbox, SearchBar) {


    return function (options) {
      var search = new SearchBar(options);

      return search;
    };

  });