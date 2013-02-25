ActiveAdmin::Dashboards.build do

  section 'Configuration', :priority => 1 do
    div link_to 'Site Configuration', '/admin/setups/view_setup'
  end

end
