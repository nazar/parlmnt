class Setup < ActiveRecord::Base

  @default_configuration = {

    :timestamps => {
      :last_sponsors_import => {:description => 'Last Sponsors import', :default => nil, :internal => true},
    }

  }

  @cache = {}

  class << self; attr_reader :default_configuration; end

  def self.sorted_by_groups
    self.default_configuration.sort{|a,b|a.first.to_s <=> b.first.to_s}
  end

  #iterate through configuration keys and save existing values from params
  def self.assign_values(params)
    self.configuration.each do |key,value|
      val = %Q{params[key]}
      eval("Setup.#{key}=#{val}") unless params[key].nil? #TODO not so keen on eval... use send instead
    end
  end

  def self.configuration
    #def conf holds grouped configs... return non-grouped view of this
    default_configuration.inject({}){|result, (key, value)| result.merge(value)}
  end

  def self.configuration?(method)
    method = method.to_s =~ /=$/ ? method.to_s.chop! : method.to_s
    configuration[method.to_sym].present?
  end

  def self.method_missing(method, args = nil)
    if configuration?(method)
      handle_configuration(method, args)
    else
      super(method, args)
    end
  end

  def self.handle_configuration(key, value)  
    key = key.to_s
    #assignment?
    if key =~ /=$/
      key.chop!
      set_key_value(key, value)
    else 
      get_key(key)
    end
  end
  
  def self.set_key_value(key, value)
    setup = find_or_initialize_by_key(key)
    setup.value_type = configuration[key.to_sym][:default].nil? ? value.class.to_s : configuration[key.to_sym][:default].class.to_s
    setup.value = value
    @cache[key] = convert_value_to_type(value, setup.value_type)
    setup.save if setup.changed?
  end

  def self.get_key(key)
    if @cache[key].present? #is it cached?
      result = @cache[key]
    else
      result = find_by_key(key) #in the database?
      if result.present?
        result = result.typecasted_value
      else #not in database.. is there a default we can use?
        result = configuration[key.to_sym][:default] unless result #get default
        #save to database as the default shouldn't be accessed multiple times
        set_key_value(key, result)
      end
    end
    @cache[key] = result
    result
  end

  def self.convert_value_to_type(value, value_type)
    return value if value_type.blank? || value.kind_of?(value_type.constantize) || value.nil?
    if    (value_type.constantize == TrueClass) || (value_type.constantize == FalseClass)  then %w[ true 1 t ].include?(value.to_s.downcase)
    elsif value_type.constantize == String     then value.to_s
    elsif value_type.constantize == Float      then value.to_f
    elsif value_type.constantize == Integer    then value.to_i
    elsif value_type.constantize == Fixnum     then value.to_i
    elsif value_type.constantize == BigDecimal then BigDecimal(value.to_s)
    elsif value_type.constantize == Class      then Object::find_const(value)
    elsif value_type.constantize == Symbol     then value.gsub(':','').to_sym
    else
      raise "unsupported type #{result.value_type}"
    end
  end

  #instance methods

  def typecasted_value
    Setup.convert_value_to_type(value, value_type)
  end

  
end
