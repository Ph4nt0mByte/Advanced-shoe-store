module Api
    module V1
      class AuthController < ApplicationController
        skip_before_action :authenticate_request
  
        def login
          user = User.find_by(email: params[:email])
          
          if user&.authenticate(params[:password])
            payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
            token = JWT.encode(payload, Rails.application.credentials.secret_key_base)
            render json: { 
              token: token, 
              user: { 
                id: user.id, 
                email: user.email, 
                name: user.name,
                admin: user.admin
              } 
            }, status: :ok
          else
            render json: { error: 'Invalid email or password' }, status: :unauthorized
          end
        end
  
        def register
          user = User.new(user_params)
          
          if user.save
            payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
            token = JWT.encode(payload, Rails.application.credentials.secret_key_base)
            render json: { 
              token: token, 
              user: { 
                id: user.id, 
                email: user.email, 
                name: user.name 
              } 
            }, status: :created
          else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
          end
        end
  
        private
  
        def user_params
          params.require(:user).permit(:name, :email, :password, :password_confirmation)
        end
      end
    end
end
