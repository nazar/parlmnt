# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Emanuel', :city => cities.first)

Party.create([

  #MPs
  {:name => 'Alliance', :short => 'alliance'},
  {:name => 'Conservative', :short => 'con'},
  {:name => 'Democratic Unionist', :short => 'du'},
  {:name => 'Independent', :short => 'ind'},
  {:name => 'Labour', :short => 'lab'},
  {:name => 'Labour/Co-operative', :short => 'lab/co-op'},
  {:name => 'Liberal Democrat', :short => 'ld'},
  {:name => 'Green Party', :short => 'green'},
  {:name => 'Plaid Cymru', :short => 'pc'},
  {:name => 'Respect', :short => 'respect'},
  {:name => 'Social Democratic and Labour Party', :short => 'sdlp'},
  {:name => 'Sinn Fein', :short => 'sf'},
  {:name => 'Scottish National Party', :short => 'snp'},
  {:name => 'Speaker of the House', :short => 'spk'},

  #Lords
  {:name => 'Crossbench'},
  {:name => 'Bishops'},
  {:name => 'Conservative Independent'},
  {:name => 'Independent Labour'},
  {:name => 'Independent Liberal Democrat'},
  {:name => 'Labour Independent'},
  {:name => 'Non-affiliated'},
  {:name => 'Other'},
  {:name => 'UK Independence Party'},
  {:name => 'Ulster Unionist Party'}

])
