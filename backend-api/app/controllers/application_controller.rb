class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :authenticate_request

  attr_reader :current_user

  private

  def authenticate_request
    header = request.headers['Authorization']
    token = header.split(' ').last if header

    if token
      begin
        decoded = JWT.decode(token, Rails.application.credentials.secret_key_base, true, { algorithm: 'HS256' })
        @current_user = User.find_by(id: decoded.first['user_id'])
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        render_unauthorized('Invalid token')
      end
    else
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