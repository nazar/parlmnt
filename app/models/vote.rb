# Vote class is defined in the acts_as_votable Gem. This class definition extends that Gem's Vote class
class Vote


  # class methods

  class << self

    def find_votable_for_user(params, user)
      if user.present?
        klass = votable_class(params[:vote][:votable_type])
        if klass.present?
          votable = klass.find_by_id(params[:vote][:votable_id])
          votable if votable.present?
        end
      end


    end

    def votable_class(klass)
      if %w(Bill Comment Vote).include?(klass.capitalize)
        klass.classify.safe_constantize
      end
    end

  end

end
