# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130225130528) do

  create_table "authorizations", :force => true do |t|
    t.string   "provider"
    t.string   "uid"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "authorizations", ["uid"], :name => "index_authorizations_on_uid"
  add_index "authorizations", ["user_id"], :name => "index_authorizations_on_user_id"

  create_table "bill_documents", :force => true do |t|
    t.integer  "bill_id"
    t.string   "name"
    t.string   "url_pdf"
    t.string   "url_html"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "bill_documents", ["bill_id"], :name => "index_bill_documents_on_bill_id"

  create_table "bill_sponsors", :force => true do |t|
    t.integer  "bill_id"
    t.integer  "sponsor_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "bill_stages", :force => true do |t|
    t.integer  "bill_id"
    t.integer  "location",   :limit => 2
    t.string   "title"
    t.string   "stage"
    t.string   "stage_url"
    t.datetime "stage_date"
    t.datetime "created_at",              :null => false
    t.datetime "updated_at",              :null => false
  end

  add_index "bill_stages", ["title"], :name => "index_bill_stages_on_title"

  create_table "bill_summaries", :force => true do |t|
    t.integer  "bill_id"
    t.integer  "rev"
    t.text     "body"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "bills", :force => true do |t|
    t.integer  "bill_type",          :limit => 2
    t.integer  "stage",              :limit => 2
    t.integer  "origin",             :limit => 2
    t.integer  "import_status",      :limit => 2
    t.integer  "house",              :limit => 2
    t.integer  "year",               :limit => 2
    t.integer  "current_stage_id"
    t.integer  "latest_summary"
    t.integer  "count_views",                        :default => 0
    t.integer  "count_posts",                        :default => 0
    t.string   "name"
    t.string   "url_details"
    t.string   "summary",            :limit => 1024
    t.datetime "bill_updated_at"
    t.datetime "created_at",                                        :null => false
    t.datetime "updated_at",                                        :null => false
    t.integer  "cached_votes_total",                 :default => 0
    t.integer  "cached_votes_up",                    :default => 0
    t.integer  "cached_votes_down",                  :default => 0
    t.integer  "cached_votes_score",                 :default => 0
    t.integer  "count_stages",                       :default => 0
  end

  add_index "bills", ["name"], :name => "index_bills_on_name"

  create_table "comments", :force => true do |t|
    t.integer  "commentable_id",                                                     :default => 0
    t.string   "commentable_type",                                                   :default => ""
    t.string   "body",               :limit => 2048
    t.integer  "user_id",                                                            :default => 0,   :null => false
    t.datetime "created_at",                                                                          :null => false
    t.datetime "updated_at",                                                                          :null => false
    t.integer  "cached_votes_total",                                                 :default => 0
    t.integer  "cached_votes_up",                                                    :default => 0
    t.integer  "cached_votes_down",                                                  :default => 0
    t.integer  "cached_votes_score",                                                 :default => 0
    t.decimal  "score",                              :precision => 16, :scale => 16, :default => 0.0
    t.string   "ancestry",           :limit => 512
  end

  add_index "comments", ["ancestry"], :name => "index_comments_on_ancestry"
  add_index "comments", ["commentable_id"], :name => "index_comments_on_commentable_id"
  add_index "comments", ["user_id"], :name => "index_comments_on_user_id"

  create_table "logs", :force => true do |t|
    t.integer  "severity",   :limit => 2
    t.string   "code"
    t.string   "error"
    t.string   "exception"
    t.string   "stack",      :limit => 512
    t.datetime "created_at",                :null => false
    t.datetime "updated_at",                :null => false
  end

  create_table "parties", :force => true do |t|
    t.string   "name"
    t.string   "short"
    t.integer  "count_mps",   :default => 0
    t.integer  "count_lords", :default => 0
    t.datetime "created_at",                 :null => false
    t.datetime "updated_at",                 :null => false
  end

  add_index "parties", ["name"], :name => "index_parties_on_name"
  add_index "parties", ["short"], :name => "index_parties_on_short"

  create_table "setups", :force => true do |t|
    t.string   "key"
    t.string   "value"
    t.string   "value_type"
    t.integer  "type"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  add_index "setups", ["key"], :name => "index_setups_on_key"

  create_table "sponsors", :force => true do |t|
    t.string   "name"
    t.string   "url_details"
    t.string   "url_photo"
    t.string   "email"
    t.string   "constituency"
    t.integer  "sponsor_type",      :limit => 2
    t.integer  "import_status",     :limit => 2
    t.integer  "party_id"
    t.integer  "count_bills",                    :default => 0
    t.datetime "import_updated_at"
    t.datetime "created_at",                                    :null => false
    t.datetime "updated_at",                                    :null => false
  end

  add_index "sponsors", ["name"], :name => "index_sponsors_on_name"
  add_index "sponsors", ["party_id"], :name => "index_sponsors_on_party_id"

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "token"
    t.string   "avatar"
    t.integer  "count_posts", :default => 0
    t.integer  "count_votes", :default => 0
    t.datetime "created_at",                 :null => false
    t.datetime "updated_at",                 :null => false
  end

  add_index "users", ["email"], :name => "index_users_on_email"
  add_index "users", ["token"], :name => "index_users_on_token"

  create_table "votes", :force => true do |t|
    t.integer  "votable_id"
    t.string   "votable_type"
    t.integer  "voter_id"
    t.string   "voter_type"
    t.boolean  "vote_flag"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
    t.string   "vote_scope"
  end

  add_index "votes", ["votable_id", "votable_type"], :name => "index_votes_on_votable_id_and_votable_type"
  add_index "votes", ["voter_id", "voter_type"], :name => "index_votes_on_voter_id_and_voter_type"

end
