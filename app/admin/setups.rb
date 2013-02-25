ActiveAdmin.register Setup do

  config.sort_order = "key"

  menu false

  config.clear_sidebar_sections!

  actions :index

  sidebar :actions, :only => :index do
    link_to 'Edit settings', '/admin/setups/view_setup'
  end

  collection_action :view_setup, :method => :get do
    @groups = Setup.sorted_by_groups
  end

  collection_action :update_setup, :method => :post do
    [:authenticity_token, :commit, :action, :controller].each{|key| params.delete(key)}
     Setup.assign_values(params)
     redirect_to '/admin/setups'
  end

  index do
    column :key do |e|
      e.key.humanize
    end
    column :value do |e|
       e.value
    end
    column :updated_at
  end


end