module Api
    module V1
      class AuthController < ApplicationController
        skip_before_action :authenticate_request, except: [:me]
  
        def login
          return render_missing_parameters unless params[:email].present? && params[:password].present?
          
          user = User.find_by(email: params[:email])
          
          if user&.authenticate(params[:password])
            render_auth_success(user)
          else
            render json: { error: 'Invalid email or password' }, status: :unauthorized
          end
        end
  
        def register
          return render_missing_parameters unless user_params.present?
          
          user = User.new(user_params)
          
          if user.save
            render_auth_success(user, :created)
          else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def me
          render json: current_user.as_json(only: [:id, :name, :email, :admin])
        end
  
        private
        
        def render_auth_success(user, status = :ok)
          payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
          token = JWT.encode(payload, Rails.application.credentials.secret_key_base)
          
          render json: { 
            token: token, 
            user: user.as_json(only: [:id, :name, :email, :admin])
          }, status: status
        end
        
        def render_missing_parameters
          render json: { error: 'Missing required parameters' }, status: :bad_request
        end
  
        def user_params
          params.require(:user).permit(:name, :email, :password, :password_confirmation)
        rescue ActionController::ParameterMissing => e
          nil
        end
      end
    end
  end
