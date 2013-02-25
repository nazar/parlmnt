require 'test_helper'

class BillsControllerTest < ActionController::TestCase

  test "should get index" do

    get :index, :format => 'json'

    p assigns.inspect
    assert_response :success
    assert_not_nil assigns(:bills)
  end

end
