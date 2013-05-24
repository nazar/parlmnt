angular.module('parlmntDeps').directive('sponsorLinks', [function() {

  return {

    scope: { sponsors: '=sponsors' },

    link: function(scope, element, atts) {
      var sponsors = scope.sponsors,
          title,
          links;

      if (scope.sponsors) {
        title = scope.sponsors.length === 1 ? 'Sponsor: ' : 'Sponsors: ';

        links = sponsors.map(function(sponsor) {
          return '<a href="#/sponsors/{id}">{name}</a>'.assign({id: sponsor.id, name: sponsor.name})
        }).join(', ');

        element.html(title + links);
      }
    }

  }

}]);