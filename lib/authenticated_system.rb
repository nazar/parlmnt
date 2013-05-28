module AuthenticatedSystem

    # Inclusion hook to make #current_user and #logged_in?
    # available as ActionView helper methods.
    def self.included(base)
      base.send :helper_method, :current_user, :logged_in? if base.respond_to? :helper_method
    end

  protected


    # Returns true or false if the user is logged in.
    # Preloads @current_user with the user model if they're logged in.
    def logged_in?
      (@current_user ||= session[:user] ? User.find_by_id(session[:user]) : :false).is_a?(User)
    end
    
    # Accesses the current user from the session.
    def current_user
      @current_user if logged_in?
    end
    
    # Store the given user in the session.
    def current_user=(new_user)
      session[:user] = (new_user.nil? || new_user.is_a?(Symbol)) ? nil : new_user.id

      @current_user = new_user
    end

end