Votes::Application.routes.draw do

  match '/auth/:provider/callback' => 'sessions#create'

  match '/register' => 'sessions#register'
  match '/login' => 'sessions#login'
  match '/me' => 'sessions#token'

  match '/search' => 'search#index', :via => [:post]

  #unRESTful routes
  post '/votes/vote' => 'votes#vote'

  #RESTful
  resources :bills, :only => [:index, :show] do
    member do
      get 'comments'
    end
    collection do
      get 'my_votes'
    end
  end

  resources :acts, :only => [:index, :show] do
    member do
      get 'comments'
    end
  end

  resources :sponsors, :only => [:show] do
    collection do
      get 'my_votes'
    end
  end

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

  resources :comments, :only => [:create, :update, :destroy] do
    member do
      post 'reply'
    end
  end

  match '/templates/:section/:view' => 'templates#show', :as => 'tpl'

  match '/' => 'pages#landing'
  match '/api' => 'pages#api'

end
