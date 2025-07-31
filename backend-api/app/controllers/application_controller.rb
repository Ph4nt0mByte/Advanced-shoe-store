class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :authenticate_request

  attr_reader :current_user

  private

  def authenticate_request
    header = request.headers['Authorization']
    Rails.logger.info "Authorization header: #{header.inspect}"
    token = header&.split(' ')&.last
    Rails.logger.info "Extracted token: #{token ? '[PRESENT]' : '[MISSING]'}"

    if token
      begin
        Rails.logger.info "Attempting to decode token..."
        decoded = JWT.decode(token, Rails.application.credentials.secret_key_base, true, { algorithm: 'HS256' })
        Rails.logger.info "Token decoded successfully. Payload: #{decoded.first.inspect}"
        
        # Handle both 'user_id' and 'id' in the token payload
        user_id = decoded.first['user_id'] || decoded.first['id']
        Rails.logger.info "Looking for user with ID: #{user_id}"
        
        @current_user = User.find_by(id: user_id)
        
        if @current_user
          Rails.logger.info "Authenticated as user: #{@current_user.email} (ID: #{@current_user.id}, Admin: #{@current_user.admin?})"
        else
          Rails.logger.error "User not found with ID: #{user_id}"
          render_unauthorized('User not found')
        end
      rescue JWT::ExpiredSignature => e
        Rails.logger.error "JWT Expired: #{e.message}"
        render_unauthorized('Token has expired')
      rescue JWT::DecodeError => e
        Rails.logger.error "JWT Decode Error: #{e.message}"
        Rails.logger.error "Token: #{token}"
        render_unauthorized('Invalid token')
      rescue ActiveRecord::RecordNotFound => e
        Rails.logger.error "User not found: #{e.message}"
        render_unauthorized('User not found')
      rescue => e
        Rails.logger.error "Authentication error: #{e.class.name}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        render_unauthorized('Authentication failed')
      end
    else
      Rails.logger.error "No token provided in Authorization header"
      render_unauthorized('Missing token')
    end
  end

  def authorize_admin
    unless current_user&.admin?
      render json: { error: 'Not authorized' }, status: :forbidden
    end
  end

  def render_unauthorized(message = 'Unauthorized')
    render json: { errors: message }, status: :unauthorized
  end
end