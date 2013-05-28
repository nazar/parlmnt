class Comment < ActiveRecord::Base

#  acts_as_tree :order => 'score'

  has_ancestry

  acts_as_votable

  validates_presence_of :body
  validates_presence_of :user

  # NOTE: install the acts_as_votable plugin if you
  # want user to vote on the quality of comments.
  #acts_as_voteable

  belongs_to :commentable, :polymorphic => true

  belongs_to :user

  after_create :update_counter_cache
  after_destroy :update_counter_cache

  before_save :set_score


#  attr_accessor :user_name, :avatar

  #Scopes

  class << self

    def find_comments_by_user(user)
      where(:user_id => user.id).order('created_at DESC')
    end

    def find_comments_for_commentable(commentable_str, commentable_id)  #TODO needed?
      where(:commentable_type => commentable_str.to_s, :commentable_id => commentable_id).order('created_at DESC')
    end

    def find_commentables_for(commentable_type, commentable_ids)
      where(:commentable_id => commentable_ids, :commentable_type => commentable_type.to_s)
    end

    def find_last_commentables_for(commentable_type, commentable_ids)
      select('c1.*').
      from('comments c1').
      where('c1.commentable_id in (?) and c2.id is null and c1.commentable_type = ? ', commentable_ids, commentable_type).
      joins('left join comments c2 on (c1.commentable_id = c2.commentable_id and c1.id < c2.id and c1.commentable_type = c2.commentable_type)')
    end

  end

  #Class methods
  class << self

    def find_commentable(commentable_str, commentable_id)
      commentable_str.constantize.find(commentable_id)
    end

    # Helper class method that allows you to build a comment
    # by passing a commentable object, a user_id, and comment text
    # example in readme
    def build_from(obj, user, comment, replying_to)
      self.new.tap do |c|
        c.commentable_id = obj.id
        c.commentable_type = obj.class.base_class.name
        c.body = comment
        c.user_id = user.id
        c.parent = replying_to if replying_to.present?
      end
    end

    def json_friendly_hash(tree)
      tree.map do |node, subs|
        {:id => node.id, :commentable_id => node.commentable_id,
         :commentable_type => node.commentable_type, :body => node.body, :updated_at =>  node.updated_at,
         :user_name => node.user.name, :avatar => node.user.avatar, :children => json_friendly_hash(subs).compact}
      end
    end

  end


  #instance methods

  def belongs_to_user?(u)
    u && (u.id == user_id)
  end

  #helper method to check if a comment has children
  def has_children?
    self.children.size > 0
  end

  # Lower bound of Wilson score confidence interval for a Bernoulli parameter
  def score_estimate
    n = (cached_votes_up.to_i + cached_votes_down.to_i).to_f

    return n if n == 0

    z = 1.96
    p = (cached_votes_up.to_f / n)

    (p + z*z/(2*n) - z * Math.sqrt((p*(1-p)+z*z/(4*n))/n))/(1+z*z/n)
  end


  protected


  def update_counter_cache
    if commentable.respond_to?('count_posts')
      commentable.count_posts = Comment.find_commentables_for(commentable_type, commentable_id).count(1)
      commentable.save
    end
  end

  def set_score
    self.score = score_estimate
  end


end
