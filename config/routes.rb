Rails.application.routes.draw do
  
  get 'signup', to: 'users#new', as: 'signup'
  get 'login', to: 'sessions#new', as: 'login'
  get 'logout', to: 'sessions#destroy', as: 'logout'

  get 'presenter', to: 'pages#presenter', as: 'presenter'
  get 'room/:room_name', to: 'pages#room', as: 'room'
  #get 'rooms/:room_id/questions/:id', to: 'questions#show_by_id'

  post 'room/join', to: 'pages#join_room'
  
  resources :rooms do
    resources :questions
  end
  resources :users
  resources :sessions
  
  root :to => 'pages#index'
  
end
