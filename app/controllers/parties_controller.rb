class PartiesController < ApplicationController

  def mps
    summary = Party.select('name, count_mps as count').where('parties.count_mps > 0')
    json_responder(summary.to_json)
  end

  def lords
    summary = Party.select('name, count_lords as count').where('parties.count_lords > 0')
    json_responder(summary.to_json)
  end


end
