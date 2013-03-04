Votes::Application.routes.draw do

  ActiveAdmin.routes(self)

  devise_for :admin_users, ActiveAdmin::Devise.config

  match '/auth/:provider/callback' => 'sessions#create'
  match '/sessions/me' => 'sessions#token'    #TODO alias not necessary

  #unRESTful routes
  post '/votes/vote' => 'votes#vote'

  #RESTful
  resources :bills, :only => [:index, :show] do
    member do
      get 'comments'
    end
  end

  resources :acts, :only => [:index, :show] do
    member do
      get 'comments'
    end
  end

  resources :votes, :only => [:create]

  resources :comments, :only => [:index, :create, :update]

  match '/' => 'bills#index'     #TODO temp... remove this once landing page is done

end
