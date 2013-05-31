class BillsController < ApplicationController

  def index
    year = params[:year] || DateTime.now.year
    @bills = Bill.search_by_year(year).bills.includes([{:sponsors => [:party]}, :current_stage, :bill_summary])

    json_responder( BillSummaryPresenter.new(@bills, 'bills', view_context) )
  end

  def show
    bill = Bill.find_by_id(params[:id])

    json_responder(bill, :serializer => BillDetailSerializer)
  end

  def comments
    commentable_comments('Bill', params[:id])
  end

  def my_votes
    votes = current_user ? current_user.find_votes_for_class(Bill) : []
    json_responder(votes, :each_serializer => VoteSerializer, :root => 'votes')
  end


end