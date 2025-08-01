require 'rails_helper'

RSpec.describe 'Authentication API', type: :request do
  let(:user) { create(:user, password: 'password123') }
  let(:valid_credentials) { { email: user.email, password: 'password123' } }
  let(:invalid_credentials) { { email: 'invalid@example.com', password: 'wrong' } }

  describe 'POST /api/v1/auth/login' do
    context 'with valid credentials' do
      before { 
        post '/api/v1/auth/login', 
          params: valid_credentials.to_json, 
          headers: default_headers 
      }

      it 'returns an authentication token' do
        expect(json_response['token']).to be_present
      end

      it 'returns user information' do
        expect(json_response['user']).to include(
          'id' => user.id,
          'email' => user.email,
          'name' => user.name,
          'admin' => user.admin
        )
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid credentials' do
      before { 
        post '/api/v1/auth/login', 
          params: invalid_credentials.to_json, 
          headers: default_headers 
      }

      it 'returns an error message' do
        expect(json_response['error']).to match(/Invalid email or password/)
      end

      it 'returns status code 401' do
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'with missing parameters' do
      before { 
        post '/api/v1/auth/login', 
          params: { email: user.email }.to_json, 
          headers: default_headers 
      }

      it 'returns an error message' do
        expect(json_response['error']).to be_present
      end

      it 'returns status code 400' do
        expect(response).to have_http_status(:bad_request)
      end
    end
  end

  describe 'POST /api/v1/auth/register' do
    let(:valid_attributes) do
      {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      }
    end

    context 'with valid parameters' do
      before { 
        post '/api/v1/auth/register', 
          params: { user: valid_attributes }.to_json, 
          headers: default_headers 
      }

      it 'creates a new user' do
        expect(json_response['user']).to include(
          'email' => 'newuser@example.com',
          'name' => 'New User'
        )
      end

      it 'returns an authentication token' do
        expect(json_response['token']).to be_present
      end

      it 'returns status code 201' do
        expect(response).to have_http_status(:created)
      end
    end

    context 'with invalid parameters' do
      before { 
        post '/api/v1/auth/register', 
          params: { user: { email: 'invalid' } }.to_json, 
          headers: default_headers 
      }

      it 'returns validation errors' do
        expect(json_response['errors']).to be_present
      end

      it 'returns status code 422' do
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'GET /api/v1/auth/me' do
    context 'with valid token' do
      before { 
        get '/api/v1/auth/me', 
          headers: auth_headers(user) 
      }

      it 'returns the current user' do
        expect(json_response['email']).to eq(user.email)
        expect(json_response['name']).to eq(user.name)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(:ok)
      end
    end

    context 'with invalid token' do
      before { 
        get '/api/v1/auth/me', 
          headers: { 'Authorization' => 'Bearer invalid_token' } 
      }

      it 'returns an error message' do
        expect(json_response['errors']).to eq('Invalid token')
      end

      it 'returns status code 401' do
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'without token' do
      before { 
        get '/api/v1/auth/me', 
          headers: default_headers 
      }

      it 'returns an error message' do
        expect(json_response['errors']).to eq('Missing token')
      end

      it 'returns status code 401' do
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
