require 'test_helper'

class CommentsControllerTest < ActionController::TestCase

  fixtures :comments, :users

  test 'REST create' do
    payload = {
      :commentable_type => 'Bill',
      :commentable_id => 1,
      :body => 'testing 123'
    }

    post(:create, payload, {:user => 123})
  end




  test 'fetch last comments and summary for list of bill IDs' do
    get(:last_comments, {:commentable_type => 'Bill', :commentable_ids => [1,2,3,4,5]})

    comments = JSON.parse(@response.body)

    assert_equal 2, comments.length, 'Expected only two messages'
    assert_equal [2,5], comments.collect{|c| c['id']}
  end

end
