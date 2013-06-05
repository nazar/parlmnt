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

  end

  #class methods

  class << self

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
