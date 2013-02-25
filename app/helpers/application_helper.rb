module ApplicationHelper

  def inside_layout(layout, &block)
    layout = layout.to_s
    layout = layout[0] == '/' ? layout : "layouts/#{layout}"
    render :inline => capture_haml(&block), :layout => layout
  end


end
