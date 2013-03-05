class SponsorVoteCacheColumns < ActiveRecord::Migration

  def up
    #comments
    add_column :sponsors, :count_posts, :integer, :default => 0

    #votes
    add_column :sponsors, :cached_votes_total, :integer, :default => 0
    add_column :sponsors, :cached_votes_score, :integer, :default => 0
    add_column :sponsors, :cached_votes_up, :integer, :default => 0
    add_column :sponsors, :cached_votes_down, :integer, :default => 0
  end

  def down
    remove_column :sponsors, :count_posts

    remove_column :sponsors, :cached_votes_total
    remove_column :sponsors, :cached_votes_score
    remove_column :sponsors, :cached_votes_up
    remove_column :sponsors, :cached_votes_down
  end

end
