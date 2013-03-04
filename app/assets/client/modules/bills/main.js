require([
  'sandbox',

  'widgets/navbar/main',
  'widgets/sidebar/main',
  'widgets/bill/main',
  'widgets/summary/main',
  'widgets/session/main',
  'widgets/votable/main',
  'widgets/commentable/main'


], function (sandbox, navbarWidget, sidebarWidget, billWidget, summaryWidget, sessionWidget, votableWidget, commentableWidget)  {

  var bills, sidebar, summary, session;

  //session manager
  sandbox.session = sessionWidget();

  //start app widgets
  navbarWidget({
    el: '#navbar',
    sessionEl: '#session'
  });

  //filter side bar
  sidebar = sidebarWidget({
    "el": '#sidebar',
    "channel": 'billFilterBar',
    "choices": {
      "Year": {
        "type":  'pick',
        "section":  'year',
        "default": '2013',
        "items": {
          "2013": {
            "tip": 'Bills in 2013'
          },
          "2012": {
            "tip": 'Bills in 2012'
          },
          "2011": {
            "tip": 'Bills in 2011'
          },
          "2010": {
            "tip": 'Bills in 2010'
          }
        }
      },

      "Sort by": {
        "type": 'pick',
        "section": 'sort',
        "default": 'name',
        "items": {
          "name": {
            "icon": '/images/name.png',
            "tip": 'Sort by Name'
          },
          "last_updated": {
            "icon": '/images/recent.png',
            "tip": 'Sort by Recent Activity'
          },
          "popular": {
            "icon": '/images/popular.png',
            "tip": 'Sort by Popularity'
          },
          "liked": {
            "icon": '/images/liked.png',
            "tip": 'Sort by Likes'
          },
          "disliked": {
            "icon": '/images/disliked.png',
            "tip": 'Sort by Dislikes'
          }
        }
      },

      "Bill Type": {
        "type": 'toggle',
        "section": 'type',
        "items": {
          "Pub": {
            "code": 'pu',
            "tip": 'Public'
          },
          "Pr": {
            "code": 'pr',
            "tip": 'Private'
          },
          "PM": {
            "code": 'prm',
            "tip": 'Private Members'
          },
          "H": {
            "code": 'hy',
            "tip": 'Hybrid'
          }
        }
      },

      "Bill Origin": {
        "type": 'toggle',
        "section": 'origin',
        "items": {
          "Commons": {
            "code": 'commons',
            "tip": 'House of Commons'
          },
          "Lords": {
            "code": 'lords',
            "tip": "House of Lords"
          }
        }
      },

      "Bill Stage": {
        "type": 'toggle',
        "section": 'stage',
        "items": {
          "1": {
            "code": "1st",
            "tip": 'First Reading'
          },
          "2": {
            "code": "2nd",
            "tip": 'Second Reading'
          },
          "C": {
            "code": "co",
            "tip": 'Committee'
          },
          "3": {
            "code": "3rd",
            "tip": 'Third Reading'
          },
          "A": {
            "code": "am",
            "tip": 'Amendments'
          }
        }
      },

      "Major Political Parties": {
        "type": 'toggle',
        "section": 'party',
        "items": {
          "Con": {
            "code": 'party-conservative',
            "tip": 'Conservatives',
            "cssClass": 'conservative'
          },
          "Lab": {
            "code": 'party-labour',
            "tip": 'Labour',
            "cssClass": 'labour'
          },
          "Ldm": {
            "code": 'party-liberal-democrat',
            "tip": 'Liberal Democrats',
            "cssClass": 'ldm'
          }
        }

      },

      "Filter Bill Titles": {
        "type": 'search',
        "section": 'nameFilter',
        "items": {
          "name": {
            "cssClass": 'input-medium',
            "placeholder": 'Search Bill by Title',
            "events": {
              "keyup": function(e) {
                var $this = $(e.target),
                  term = $this.val().toLowerCase(),
                  ignore = [37, 39];

                console.log('keyuuuuuup', e, term);

                if (ignore.none(e.which) ) {
                  sandbox.publish('BillSearchName', term);
                }
              }
            }
          }
        }
      }
    }
  });

  summary = summaryWidget({el: '#bills-summary'});

  bills = billWidget({
    el: '#bills',
    channel: 'billsDetail',
    votableBuilder: votableWidget,
    commentableBuilder: commentableWidget,
    commentsPath: sandbox.routes.comments_bill_path
  });

  summary.render().startLoader();

  sandbox.analytics.init();
  sandbox.analytics.identify();
  sandbox.analytics.track('Viewing Bills');


  //hook up all widgets view pub/sub

  sandbox.subscribe('aboutToReload', function () { //'billsDetail'
    summary.startLoader();
  });

  sandbox.subscribe('billsLoaded', function () { //'billsDetail'
    summary.stopLoader();
  });

  sandbox.subscribe('summaryChanged', function (summaryObject) {
    summary.setTitledSummary(summaryObject);
  });

  sandbox.subscribe('FilterChanged', function (selections) {
    bills.filteringAndSorting(selections);
  });

  sandbox.subscribe('BillSearchName', function (term) {
    bills.showMatchedBills(term);
  });

  sandbox.subscribe('relayout', function () {
    bills.relayout();
  });

  sandbox.subscribe('sessionReload', function() {
    sandbox.session.reload();
  });

  sidebar.initDefaults();


});