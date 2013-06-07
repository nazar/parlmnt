class BillsStatsPresenter

  #def initialize(scope = Bill)
  #  @scope = scope
  #end

  def bills_and_acts
    Bill.select('bills.year, parties.name, count(1) count').
      joins(scope_joiner).
      group('bills.year, parties.name')
  end

  def bills
    bills_and_acts.bills
  end

  def acts
    bills_and_acts.acts
  end


  private


  def scope_joiner
    <<-EOF
      inner join bill_sponsors on
        bills.id = bill_sponsors.bill_id inner join sponsors on
        bill_sponsors.sponsor_id = sponsors.id inner join parties on
        sponsors.party_id = parties.id inner join bill_stages on
        bill_stages.id = bills.current_stage_id
    EOF
  end


end