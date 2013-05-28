class MpsController < SponsorsController

  def index
    mps = Sponsor.mps.order('name').includes([:party])
    json_responder(mps, :each_serializer => SponsorIndexSerializer)
  end


end
