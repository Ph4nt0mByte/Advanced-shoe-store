module AuthenticationHelpers
  def login_as(user)
    post '/api/v1/auth/login', params: { email: user.email, password: 'password123' }
    JSON.parse(response.body)['token']
  end
  
  def auth_headers(user)
    token = login_as(user)
    { 'Authorization' => "Bearer #{token}" }
  end
end

RSpec.configure do |config|
  config.include AuthenticationHelpers, type: :request
end
