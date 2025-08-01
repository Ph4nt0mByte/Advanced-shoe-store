Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      post 'auth/login', to: 'auth#login'
      post 'auth/register', to: 'auth#register'
      get 'auth/me', to: 'auth#me'
      
      resources :products, only: [:index, :show, :create, :update, :destroy] do
        post 'restore', on: :member
        get 'deleted', on: :collection
      end
      
<<<<<<< HEAD
=======
      resources :messages, only: [:create]
      
      # Cart routes
>>>>>>> d49244d95a04e5e4205f579899cc59e65054130d
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
