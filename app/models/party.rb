class Party < ActiveRecord::Base

  PARTY_SHORT_TO_LONG = {
    #MPs
    :alliance => 'Alliance',
    :con => 'Conservative',
    :du => 'Democratic Unionist',
    :ind => 'Independent',
    :lab => 'Labour',
    :'lab/co-op' => 'Labour/Co-operative',
    :ld => 'Liberal Democrat',
    :green => 'Green Party',
    :pc => 'Plaid Cymru',
    :respect => 'Respect',
    :sdlp => 'Social Democratic and Labour Party',
    :sf => 'Sinn Fein',
    :snp => 'Scottish National Party',
    :spk => 'Speaker of the House',
    #Lords
    :l_cb => 'Crossbench',
    :l_bs => 'Bishops',
    :l_ci => 'Conservative Independent',
    :l_il => 'Independent Labour',
    :l_ild => 'Independent Liberal Democrat',
    :l_li => 'Labour Independent',
    :l_na => 'Non-affiliated',
    :l_ot => 'Other',
    :l_uip => 'UK Independence Party',
    :l_uup => 'Ulster Unionist Party',

  }


  validates_presence_of :name
  validates_uniqueness_of :name

  attr_accessible :name, :short

  has_many :sponsors



  #scopes

  class << self

    def find_by_short(short_name)
      where(:short => short_name)
    end

    def find_by_name(name)
      where(:name => name)
    end

  end

  #class methods

  class << self




    # Given an array of short party names (as scraped from MP list) create and return array of party objects referenced by short name
    # @param [Array] short_names unique list of abbreviated party names
    # @return [Hash] returns a Hash of party objects each referenced by short_name
    def sync_short_party_names(short_names)
      {}.tap do |result|
        short_names.each do |short_name|
          short = short_name.downcase.to_sym
          name = PARTY_SHORT_TO_LONG[short]
          if name.blank?
            raise "#{short} is not a recognised party short_name"
          else
            party = find_by_short(short.to_s).first_or_create!(:name => name)
          end
          result[short_name] = party
        end
      end
    end

    def sync_party_names(names)
      {}.tap do |result|
        names.each do |party_name|
          if PARTY_SHORT_TO_LONG.has_value?(party_name)
            party = find_by_name(party_name).first_or_create!(:short => PARTY_SHORT_TO_LONG.invert[party_name])
          else
            raise "#{party_name} is not a valid party name"
          end
          result[party_name] = party
        end
      end
    end

    def update_mp_counter(party, count)
      party.count_mps = count
      party.save
    end

    def update_lords_counter(party, count)
      party.count_lords = count
      party.save
    end

  end

end
