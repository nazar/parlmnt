# PARLMT.com

[Parlmt](parlmnt.com) imports data from [www.parliament.uk](www.parliament.uk), specifically [Bills & Legislation](http://www.parliament.uk/business/bills-and-legislation/), [Members of Parliament](http://www.parliament.uk/mps-lords-and-offices/mps/) and [Members of House of Lords](http://www.parliament.uk/mps-lords-and-offices/lords/).

This data serves two purposes:

+ **Interactive Presentation**: Visitors can up/down vote and leave comments against Legislation Bills
+ **JSON Api**: Bills, MPs and Lords data is presented in a JSON API

# Application Structure

## Server

Ruby on Rails 3.x is used as a mostly viewless API layer which presents relevant data in both JSON and XML formats.

## Client

All presentation is created by the [Backbone.js](http://backbonejs.org) based client.

# Source Code

## Backbone Client

All client code is located at [/root/app/assets/client](https://github.com/nazar/parlmnt/tree/master/app/assets/client) and is effectively a self contained Backbone application with its own build process. Rail's Sprockets is not used to build application.js but merely points to a Require.js r.js optimised file in the build directory located in /root/app/assets/client/build.

A widget based approach is employed to organise the application's views with each widget having exclusive responsibility for managing an application domain. Event messaging is employed to notify interested widgets of action or requests. This helps minimise widget dependencies (although not completely)

# Motivation

## Moar Interactivity

Although the Parliament website is functional, it is somewhat lacking in interactivity; visitors are not able to voice opions on Bills nor use them as topics for discussion or discourse.

## Better API

[Parliament.uk](Parliament.uk) presents  all its data as HTML. Specific data such as a Bill's [details](http://services.parliament.uk/bills/2012-13/antarctic.html), [stages](http://services.parliament.uk/bills/2012-13/antarctic/stages.html), [documents](http://services.parliament.uk/bills/2012-13/antarctic/documents.html), and most crucially [votes](http://www.publications.parliament.uk/pa/cm201213/cmhansrd/cm130129/debtext/130129-0002.htm#13012946000001) and so on can only be extracted by scraping the relevant pages.

This application aims to provide a JSON and XML API for accessing both Bills and Parliamentarian's details.

## My Nephew

My nephew (and [parlmnt.com](parlmnt.com) co-founder) is a bright kid and I am trying to nudge him to showing at least a passing interest in computing and software development. Several aspects of this application were designed with his feedback.


# Installation

## 1. Setup Database

```shell
  bundle install --path vendor/bundle
  bundle exec rake db:migrate
```

## 2. Install Dependencies


**ActiveAdmin**

```shell
  bundle exec rails generate active_admin:install
  bundle exec rake db:migrate
```

## 3. Parlmt Configuration

Start parlmnt:

```shell
  bundle exec rails s mongrel
```

Navigate to localhost:[port]/admin and login using **username:** admin@example.com and **password:** password

Click on the Administrators Menu item and add a new administrator by simply adding their email address. The new administrator will receive a password reset email to the previously given email address during which time she can set the password. **Please delete the default administrator user once past this stage**.

Navigate to localhost:[port]/admin/setups/view_setup to configure omniauth and the Secret token for all oauth providers.

Restart parlmnt at this stage.

## 4. Data Import

The newly created database will be empty. To populate parlmnt from parliament.uk run:

```shell
  bundle exec rake import:all
```

The above should take about an hour to import but the end of the process all Bills, MPs and Lords should have been imported.

# Contributing

## Building the Client

[/root/app/assets/client](https://github.com/nazar/parlmnt/tree/master/app/assets/client) contains the client root, which has it's own build process. To install required tools for building:

```shell
  npm install
```

Once installed, the client would have to be rebuilt every time a change is made via:

```shell
  make
```

The above concatenates all JS files in order and is output to the build directory, which Rails's Sprockets accesses.

# Contributors

* [Nazar Aziz](http://panthersoftware.com). Initial design and developer
* Sunil Taper. Contributing designer
