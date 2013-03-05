Votes::Application.routes.draw do

  ActiveAdmin.routes(self)

  devise_for :admin_users, ActiveAdmin::Devise.config

  match '/auth/:provider/callback' => 'sessions#create'
  match '/sessions/me' => 'sessions#token'    #TODO alias not necessary

  match '/search' => 'search#index', :via => [:post]

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

  resources :sponsors, :only => [:show]

  resources :mps, :only => [:index, :show] do
    member do
      get 'comments'
    end
  end

  resources :lords, :only => [:index, :show] do
    member do
      get 'comments'
    end
  end

  resources :votes, :only => [:create]

  resources :comments, :only => [:create, :update]

  match '/' => 'bills#index'
  match '/api' => 'pages#api'

end
