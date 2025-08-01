module RequestHelpers
  def json_response
    return {} if response.body.empty?
    
    begin
      JSON.parse(response.body)
    rescue JSON::ParserError
      {}
    end
  end
  
  def auth_headers(user)
    post '/api/v1/auth/login', params: { email: user.email, password: 'password123' }
    token = json_response['token']
    { 'Authorization' => "Bearer #{token}", 'Content-Type' => 'application/json' }
  end
  
  def default_headers
    { 'Content-Type' => 'application/json' }
  end
end

RSpec.configure do |config|
  config.include RequestHelpers, type: :request
  
  config.define_derived_metadata(file_path: %r{/spec/requests/}) do |metadata|
    metadata[:type] = :request
  end
end
