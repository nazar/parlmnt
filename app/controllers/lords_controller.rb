class LordsController < SponsorsController

  def index
    mps = Sponsor.lords.order('name').includes([:party])
    sponsors_responder(mps)
  end


end
