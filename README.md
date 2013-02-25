# PARLMT.com

Parlmt imports data from [www.parliament.uk](www.parliament.uk), specifically [Bills & Legislation](http://www.parliament.uk/business/bills-and-legislation/), [Members of Parliament](http://www.parliament.uk/mps-lords-and-offices/mps/) and [Members of House of Lords](http://www.parliament.uk/mps-lords-and-offices/lords/).

This data serves two purposes:

+ **Interactive Presentation**: Bills and Legislation is presented using cards which visitors can up/down vote and leave comments against
+ **JSON Api**: Bills, MPs and Lords data is presented in a JSON API

# Application Structure

## Server

Ruby on Rails 3.x is used as a mostly viewless API layer which presents relevant data in both JSON and XML formats.

## Client

All presentation is created by the [Backbone.js](http://backbonejs.org) based client.

# Source Code

## Client

All client code is located at /root/app/assets/client and is effectively a self contained Backbone application with its own build process. Rail's Sprockets is not used to build application.js but merely points to a Require.js r.js optimised file in the build directory located in /root/app/assets/client/build.

A widget based approach is employed to organise the application's views with each widget having exclusive responsibility for managing an application domain. Event messaging is employed to notify interested widgets of action or requests. This helps minimise widget dependencies (although not completely)

# Installation

## 1. Setup Database

```ruby
  bundle exec rake db:migrate
```

## 2. Install Dependancies


**ActiveAdmin**

```ruby
  bundle exec rails generate active_admin:install
  bundle exec rake db:migrate
```

## 3. Parlmt Configuration

Start parlmnt:

```ruby
  bundle exec rails s mongrel
```

Navigate to localhost:[port]/admin and login using **username:** admin@example.com and **password:** password

Navigate to localhost:[port]/admin/setups/view_setup to configure omniauth and the Secret token


## 4. Data Import

```ruby
  bundle exec rake import:all
```



# Contribution

**TODO**

# Credits

**TODO**