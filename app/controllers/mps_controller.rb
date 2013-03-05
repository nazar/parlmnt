class MpsController < SponsorsController

  def index
    mps = Sponsor.mps.order('name').includes([:party])
    sponsors_responder(mps)
  end


end
