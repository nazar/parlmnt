class SponsorsToConstituencyLink < ActiveRecord::Migration

  def up
    rename_column :sponsors, :constituency, :constituency_name

    Sponsor.where('constituency_name is not null').each do |sponsor|
      constituency = Constituency.create(:name => sponsor.constituency_name)

      sponsor.constituency_id = constituency.id
      sponsor.save!
    end
  end

  def down
    rename_column :sponsors, :constituency_name, :constituency
  end

end
