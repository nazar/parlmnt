(function(){

  function ParameterMissing(message) {
   this.message = message;
  }
  ParameterMissing.prototype = new Error(); 

  var defaults = {
    prefix: '',
    default_url_options: {"format":"json"}
  };

  var NodeTypes = {"GROUP":1,"CAT":2,"SYMBOL":3,"OR":4,"STAR":5,"LITERAL":6,"SLASH":7,"DOT":8};
  
  var Utils = {

    serialize: function(obj){
      if (!obj) {return '';}
      if (window.jQuery) {
        var result = window.jQuery.param(obj);
        return !result ? "" : "?" + result
      }
      var s = [];
      for (prop in obj){
        if (obj[prop]) {
          if (obj[prop] instanceof Array) {
            for (var i=0; i < obj[prop].length; i++) {
              key = prop + encodeURIComponent("[]");
              s.push(key + "=" + encodeURIComponent(obj[prop][i].toString()));
            }
          } else {
            s.push(prop + "=" + encodeURIComponent(obj[prop].toString()));
          }
        }
      }
      if (s.length === 0) {
        return '';
      }
      return "?" + s.join('&');
    },

    clean_path: function(path) {
      path = path.split("://");
      var last_index = path.length - 1;
      path[last_index] = path[last_index].replace(/\/+/g, "/").replace(/\/$/m, '');
      return path.join("://");
    },

    set_default_url_options: function(optional_parts, options) {
      for (var i=0;i < optional_parts.length; i++) {
        var part = optional_parts[i];
        if (!options.hasOwnProperty(part) && defaults.default_url_options.hasOwnProperty(part)) {
          options[part] = defaults.default_url_options[part];
        }
      }
    },

    extract_anchor: function(options) {
      var anchor = options.hasOwnProperty("anchor") ? options.anchor : null;
      delete options.anchor;
      return anchor ? "#" + anchor : "";
    },

    extract_options: function(number_of_params, args) {
      if (args.length > number_of_params) {
        return typeof(args[args.length-1]) == "object" ?  args.pop() : {};
      } else {
        return {};
      }
    },

    path_identifier: function(object) {
      if (object === 0) {
        return '0';
      }

      if (! object) { // null, undefined, false or ''
        return '';
      }

      if (typeof(object) == "object") {
        var property = object.to_param || object.id || object;
        if (typeof(property) == "function") {
          property = property.call(object)
        }
        return property.toString();
      } else {
        return object.toString();
      }
    },

    clone: function (obj) {
      if (null == obj || "object" != typeof obj) return obj;
      var copy = obj.constructor();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }
      return copy;
    },

    prepare_parameters: function(required_parameters, actual_parameters, options) {
      var result = this.clone(options) || {};
      for (var i=0; i < required_parameters.length; i++) {
        result[required_parameters[i]] = actual_parameters[i];
      }
      return result;
    },

    build_path: function(required_parameters, optional_parts, route, args) {
      args = Array.prototype.slice.call(args);
      var opts = this.extract_options(required_parameters.length, args);
      if (args.length > required_parameters.length) {
        throw new Error("Too many parameters provided for path");
      }

      var parameters = this.prepare_parameters(required_parameters, args, opts);
      this.set_default_url_options(optional_parts, parameters);
      var result = Utils.get_prefix();
      var anchor = Utils.extract_anchor(parameters);

      result += this.visit(route, parameters)
      return Utils.clean_path(result + anchor) + Utils.serialize(parameters);
    },

    /*
     * This function is JavaScript impelementation of the
     * Journey::Visitors::Formatter that builds route by given parameters
     * from route binary tree.
     * Binary tree is serialized in the following way:
     * [node type, left node, right node ]
     *
     * @param  {Boolean} optional  Marks the currently visited branch as optional. 
     *   If set to `true`, this method will not throw when encountering 
     *   a missing parameter (used in recursive calls).
     */
    visit: function(route, parameters, optional) {
      var type = route[0];
      var left = route[1];
      var right = route[2];
      switch (type) {
        case NodeTypes.GROUP:
          return this.visit(left, parameters, true)
        case NodeTypes.STAR:
          return this.visit(left, parameters, true)
        case NodeTypes.CAT:
          var leftPart = this.visit(left, parameters, optional),
              rightPart = this.visit(right, parameters, optional);

          if (optional && ! (leftPart && rightPart))
            return '';

          return leftPart + rightPart;
        case NodeTypes.LITERAL:
          return left;
        case NodeTypes.SLASH:
          return left;
        case NodeTypes.DOT:
          return left;
        case NodeTypes.SYMBOL:
          var value = parameters[left];

          if (value || value === 0) {
            delete parameters[left];
            return this.path_identifier(value);
          }

          if (optional) {
            return '';  // missing parameter
          } else {
            throw new ParameterMissing("Route parameter missing: " + left);
          }
        /*
         * I don't know what is this node type
         * Please send your PR if you do
         */
        //case NodeTypes.OR:
        default:
          throw new Error("Unknown Rails node type");
      }
    },

    get_prefix: function(){
      var prefix = defaults.prefix;

      if( prefix !== "" ){
        prefix = prefix.match('\/$') ? prefix : ( prefix + '/');
      }
      
      return prefix;
    },

    namespace: function (root, namespaceString) {
        var parts = namespaceString ? namespaceString.split('.') : [];
        if (parts.length > 0) {
            current = parts.shift();
            root[current] = root[current] || {};
            Utils.namespace(root[current], parts.join('.'));
        }
    }
  };

  Utils.namespace(window, 'Routes');
  window.Routes = {
// act => /acts/:id(.:format)
  act_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"acts",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// acts => /acts(.:format)
  acts_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"acts",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// bill => /bills/:id(.:format)
  bill_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"bills",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// bills => /bills(.:format)
  bills_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"bills",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// comment => /comments/:id(.:format)
  comment_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"comments",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// comments => /comments(.:format)
  comments_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"comments",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// comments_act => /acts/:id/comments(.:format)
  comments_act_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"acts",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"comments",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// comments_bill => /bills/:id/comments(.:format)
  comments_bill_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"bills",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"comments",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// comments_lord => /lords/:id/comments(.:format)
  comments_lord_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"lords",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"comments",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// comments_mp => /mps/:id/comments(.:format)
  comments_mp_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"mps",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"comments",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// login => /login(.:format)
  login_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"login",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// logout => /logout(.:format)
  logout_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"logout",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// lord => /lords/:id(.:format)
  lord_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"lords",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// lords => /lords(.:format)
  lords_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"lords",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// me => /me(.:format)
  me_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"me",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// mp => /mps/:id(.:format)
  mp_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"mps",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// mps => /mps(.:format)
  mps_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"mps",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// my_votes_bills => /bills/my_votes(.:format)
  my_votes_bills_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"bills",false]],[7,"/",false]],[6,"my_votes",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// my_votes_sponsors => /sponsors/my_votes(.:format)
  my_votes_sponsors_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"sponsors",false]],[7,"/",false]],[6,"my_votes",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// register => /register(.:format)
  register_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"register",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// reply_comment => /comments/:id/reply(.:format)
  reply_comment_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"comments",false]],[7,"/",false]],[3,"id",false]],[7,"/",false]],[6,"reply",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// search => /search(.:format)
  search_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"search",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// sponsor => /sponsors/:id(.:format)
  sponsor_path: function(_id, options) {
  return Utils.build_path(["id"], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"sponsors",false]],[7,"/",false]],[3,"id",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// token_user => /user/token(.:format)
  token_user_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"user",false]],[7,"/",false]],[6,"token",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// tpl => /templates/:section/:view(.:format)
  tpl_path: function(_section, _view, options) {
  return Utils.build_path(["section","view"], ["format"], [2,[2,[2,[2,[2,[2,[7,"/",false],[6,"templates",false]],[7,"/",false]],[3,"section",false]],[7,"/",false]],[3,"view",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// user => /user(.:format)
  user_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"user",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// votes => /votes(.:format)
  votes_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[7,"/",false],[6,"votes",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  },
// votes_vote => /votes/vote(.:format)
  votes_vote_path: function(options) {
  return Utils.build_path([], ["format"], [2,[2,[2,[2,[7,"/",false],[6,"votes",false]],[7,"/",false]],[6,"vote",false]],[1,[2,[8,".",false],[3,"format",false]],false]], arguments);
  }}
;
  window.Routes.options = defaults;
})();
