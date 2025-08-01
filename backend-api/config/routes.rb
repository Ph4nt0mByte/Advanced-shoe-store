Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  namespace :api do
    namespace :v1 do
      post 'auth/login', to: 'auth#login'
      post 'auth/register', to: 'auth#register'
      get 'auth/me', to: 'auth#me'
      
      resources :products, only: [:index, :show, :create, :update, :destroy] do
        post 'restore', on: :member
        get 'deleted', on: :collection
      end
      
      resources :messages, only: [:create]
      
      # Cart routes
      resource :cart, only: [:show] do
        post 'items', to: 'carts#add_item'
        patch 'items/:id', to: 'carts#update_item'
        delete 'items/:id', to: 'carts#remove_item'
        delete 'clear', to: 'carts#clear'
      end
      
      resources :orders, only: [:index, :show, :create]
    end
  end
end
